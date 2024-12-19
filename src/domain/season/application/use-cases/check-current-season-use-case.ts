import { SeasonsRepository } from "../repositories/seasons-repository";
import { env } from "../../../../infra/env";
import { Season } from "../../enterprise/entities/season";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { PlayerSeasonPointsRepository } from "../repositories/player-season-points-repository";
import { PlayerSeasonPoints } from "../../enterprise/entities/player-season-points";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { PlayerTotalPointsRepository } from "../repositories/player-total-points-repository";
import { PlayerTotalPoints } from "../../enterprise/entities/player-total-points";
import { ApplicationLogRepository } from "../repositories/application-log-repository";
import { LogOrigin, LogLevel } from "../../../../core/enums/log-enum";

export class CheckCurrentSeasonUseCase {

  constructor(
    private seasonsRepository: SeasonsRepository,
    private playersRepository: PlayersRepository,
    private playerSeasonPointsRepository: PlayerSeasonPointsRepository,
    private playerTotalPointsRepository: PlayerTotalPointsRepository,
    private applicationLogRepository: ApplicationLogRepository
  ) { }

  execute = async () => {
    // Step 1: Check if there is an active season
    const activeSeason = await this.seasonsRepository.findActive();
    const currentDate = new Date();

    let updatedToInactiveSeason;
    // Step 2: Check if the active season has ended
    if (activeSeason) {
      const endAt = new Date(activeSeason.endAt);
      // Step 3: Deactivate the ended season
      if (currentDate > endAt) {
        await this.addSeasonTierAndProgressToTotalPoints(activeSeason.id ?? 0);
        updatedToInactiveSeason = await this.seasonsRepository.updateToInactive(activeSeason.id ?? 0);
        await this.applicationLogRepository.create({
          content: `updated season to inactive ${updatedToInactiveSeason.id}`,
          level: LogLevel.INFO,
          origin: LogOrigin.CHECK_CURRENT_SEASON_CRON
        });
      }
    }

    // Step 4: Find the next season to activate
    // const nextSeason = await this.seasonsRepository.findSeasonByCurrentDate();
    const nextSeason = await this.seasonsRepository.findActive();
    if (nextSeason && (!updatedToInactiveSeason?.active || nextSeason.id !== updatedToInactiveSeason.id)) {
      await this.applicationLogRepository.create({
        content: `next season found ${nextSeason.id}`,
        level: LogLevel.INFO,
        origin: LogOrigin.CHECK_CURRENT_SEASON_CRON
      });
      // Step 5: Activate the next season
      await this.updateSeasonToActiveAndCreateNewSeasonRegistries(nextSeason.id ?? 0);
    } else if (!nextSeason && !updatedToInactiveSeason?.active) {
      await this.applicationLogRepository.create({
        content: `next season not found and actual season inactivate, creating a new one`,
        level: LogLevel.INFO,
        origin: LogOrigin.CHECK_CURRENT_SEASON_CRON
      });
      // Step 6: Create a new season with default duration if no active or next season
      await this.createSeasonWithDefaultDuration();
    }
  }

  private updateSeasonToActiveAndCreateNewSeasonRegistries = async (nextSeasonId: number) => {
    const activeSeason = await this.seasonsRepository.updateToActive(nextSeasonId);
    if (!activeSeason || !activeSeason.id) return;
    await this.createNewSeasonRegistersForAllPlayers(activeSeason.id);
  }

  private createSeasonWithDefaultDuration = async () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + env.DEFAULT_SEASON_DURATION_IN_DAYS);

    const newSeason = await this.seasonsRepository.create(Season.create({
      name: `Season ${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
      description: `Season ${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
      startAt: startDate,
      endAt: endDate,
      active: true,
    }));

    if (!newSeason || !newSeason.id) {
      await this.applicationLogRepository.create({
        content: `createSeasonWithDefaultDuration: no season or season id founded`,
        level: LogLevel.ERROR,
        origin: LogOrigin.CHECK_CURRENT_SEASON_CRON
      });
      throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Season not found");
    }

    await this.createNewSeasonRegistersForAllPlayers(newSeason.id);
  }

  private createNewSeasonRegistersForAllPlayers = async (seasonId: number) => {
    await this.applicationLogRepository.create({
      content: `starting to create registers of new season to all players`,
      level: LogLevel.INFO,
      origin: LogOrigin.CHECK_CURRENT_SEASON_CRON
    });
    const allPlayers = await this.playersRepository.fetchAllPlayers();
    for (const player of allPlayers) {
      const existingRegister = await this.playerSeasonPointsRepository.findBySeasonAndProviderPlayerId(seasonId, player.providerPlayerId);
      if (!existingRegister) {
        const newPlayerSeasonPoints = PlayerSeasonPoints.create({
          seasonId: seasonId,
          providerPlayerId: player.providerPlayerId,
          points: 0,
          tier: 3,
          lastTier: 3,
          progress: 0,
        });
        await this.playerSeasonPointsRepository.create(newPlayerSeasonPoints);
      }
    }
    await this.applicationLogRepository.create({
      content: `finishing to create registers of new season to all players`,
      level: LogLevel.INFO,
      origin: LogOrigin.CHECK_CURRENT_SEASON_CRON
    });
  }

  private addSeasonTierAndProgressToTotalPoints = async (seasonId: number) => {
    const seasonPoints = await this.playerSeasonPointsRepository.findBySeasonId(seasonId);
    for (const playerSeasonPoints of seasonPoints) {
      const totalPoints = await this.playerTotalPointsRepository.findByProviderPlayerId(playerSeasonPoints.providerPlayerId);
      if (totalPoints) {
        await this.playerTotalPointsRepository.update(totalPoints.id ?? 0, {
          tier: playerSeasonPoints.tier,
          tierLastUpdatedTime: new Date(),
          progress: playerSeasonPoints.progress
        });
      } else {
        const newPlayerTotalPoints = PlayerTotalPoints.create({
          points: playerSeasonPoints.points,
          providerPlayerId: playerSeasonPoints.providerPlayerId,
          tierLastUpdatedTime: new Date(),
          tier: playerSeasonPoints.tier,
          progress: playerSeasonPoints.progress
        });
        await this.playerTotalPointsRepository.create(newPlayerTotalPoints);
      }
    }
  }
}