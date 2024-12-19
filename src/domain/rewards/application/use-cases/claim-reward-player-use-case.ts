import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { RewardsHistoryRepository } from "../repositories/rewards-history-repository";
import { RewardsRepository } from "../repositories/rewards-repository";
import { PlayerSeasonPointsRepository } from "../../../season/application/repositories/player-season-points-repository";
import { PlayerTotalPointsRepository } from "../../../season/application/repositories/player-total-points-repository";
import { SeasonsRepository } from "../../../season/application/repositories/seasons-repository";
import { PlayerSeasonPoints } from "../../../season/enterprise/entities/player-season-points";
import { PlayerTotalPoints } from "../../../season/enterprise/entities/player-total-points";
import { AuthPlayerProvider } from "../../../user/application/auth-provider/auth-player-provider";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";

export class ClaimRewardPlayerUseCase {
  constructor(
    private authProvider: AuthPlayerProvider,
    private playersRepository: PlayersRepository,
    private playerSeasonPointsRepository: PlayerSeasonPointsRepository,
    private playerTotalPointsRepository: PlayerTotalPointsRepository,
    private rewardsRepository: RewardsRepository,
    private rewardsHistoryRepository: RewardsHistoryRepository,
    private seasonsRepository: SeasonsRepository
  ) {}

  execute = async (reward: string, accessToken: string) => {
    if (!reward) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "You have to send de type of reward");

    const rewardExists = await this.rewardsRepository.findRewardByName(reward);
    if (!rewardExists) throw new HttpException(HttpStatus.NOT_FOUND, "Reward not found");
    const providerPlayer = await this.authProvider.getPlayer(accessToken);
    if (!providerPlayer) throw new HttpException(HttpStatus.NOT_FOUND, "Player not found");
    const player = await this.playersRepository.findPlayerByProviderId(providerPlayer.providerPlayerId);
    if (!player) throw new HttpException(HttpStatus.UNAUTHORIZED, "User is not a player yet");
    const activeSeason = await this.seasonsRepository.findActive();
    if (!activeSeason || !activeSeason.id) throw new HttpException(HttpStatus.BAD_REQUEST, "No active season");
    const history = rewardExists.RewardsHistory.filter(x => x.providerPlayerId === providerPlayer.providerPlayerId).sort(
      (a: any, b: any) => a.createdAt - b.createdAt
    );
    if (history.length > 0) {
      const date = history[history.length - 1].availableAt;
      if (date > new Date())
        throw new HttpException(HttpStatus.UNAUTHORIZED, "You gotta wait for the remaining time to claim a new reward");
    }

    let availableDate = new Date();
    availableDate.setTime(availableDate.getTime() + 24 * 60 * 60 * 1000);

    const playerPoints = await this.includePlayerPoints(player.providerPlayerId, rewardExists.points, activeSeason.id);
    if (playerPoints) throw new HttpException(HttpStatus.BAD_REQUEST, "Error insert points for player");

    const insertRewardHistory = await this.rewardsHistoryRepository.create({
      providerPlayerId: player.providerPlayerId,
      rewardId: rewardExists.id,
      rewardPoints: rewardExists.points,
      availableDate
    });

    return insertRewardHistory;
  };

  private includePlayerPoints = async (
    providerPlayerId: string,
    pointsToAdd: number,
    seasonId: number
  ): Promise<boolean> => {
    const seasonPoints = await this.includeSeasonPoints(seasonId, providerPlayerId, pointsToAdd);
    const totalPoints = await this.includeTotalPoints(providerPlayerId, pointsToAdd);
    return seasonPoints && totalPoints ? true : false;
  };

  private includeSeasonPoints = async (seasonId: number, providerPlayerId: string, pointsToAdd: number) => {
    const seasonPoints = await this.playerSeasonPointsRepository.findBySeasonAndProviderPlayerId(
      seasonId,
      providerPlayerId
    );
    if (!seasonPoints) {
      const seasonPoints = PlayerSeasonPoints.create({
        points: pointsToAdd,
        providerPlayerId: providerPlayerId,
        seasonId: seasonId,
        tier: 3,
        lastTier: 3,
        progress: 0
      });
      return await this.playerSeasonPointsRepository.create(seasonPoints);
    }

    const updatedSeasonPoints = await this.playerSeasonPointsRepository.updatePlayerPointsRegister(
      seasonPoints.id ?? 0,
      {
        points: seasonPoints.points + pointsToAdd
      }
    );

    return updatedSeasonPoints;
  };

  private includeTotalPoints = async (providerPlayerId: string, pointsToAdd: number) => {
    const totalPoints = await this.playerTotalPointsRepository.findByProviderPlayerId(providerPlayerId);
    if (!totalPoints) {
      const totalPoints = PlayerTotalPoints.create({
        points: pointsToAdd,
        providerPlayerId: providerPlayerId,
        tierLastUpdatedTime: new Date(),
        tier: 3,
        progress: 0
      });
      return await this.playerTotalPointsRepository.create(totalPoints);
    }

    const updatedTotalPoints = await this.playerTotalPointsRepository.update(totalPoints.id ?? 0, {
      points: totalPoints.points + pointsToAdd
    });

    return updatedTotalPoints;
  };
}
