import { beforeEach, describe, expect, it } from 'vitest';
import { SeasonsRepositoryInMemory } from '../../../../../../tests/repository/seasons-repository-in-memory';
import { makeSeason } from '../../../../../../tests/factories/make-season';
import { CheckCurrentSeasonUseCase } from '../check-current-season-use-case';
import { PlayersRepositoryInMemory } from '../../../../../../tests/repository/players-repository-in-memory';
import { PlayerSeasonPointsRepositoryInMemory } from '../../../../../../tests/repository/player-season-points-repository-in-memory';
import { PlayerTotalPointsRepositoryInMemory } from '../../../../../../tests/repository/player-total-points-repository-in-memory';
import { makePlayer } from '../../../../../../tests/factories/make-player';
import { randomUUID } from 'crypto';
import { PlayerSeasonPoints } from '../../../enterprise/entities/player-season-points';
import { ApplicationLogRepositoryInMemory } from '../../../../../../tests/repository/application-log-repository-in-memory';

let seasonsRepository: SeasonsRepositoryInMemory;
let playersRepository: PlayersRepositoryInMemory;
let playerSeasonPointsRepository: PlayerSeasonPointsRepositoryInMemory;
let playerTotalPointsRepository: PlayerTotalPointsRepositoryInMemory;
let applicationLogRepository: ApplicationLogRepositoryInMemory;
let sut: CheckCurrentSeasonUseCase;

describe("Check Current Season", () => {
  beforeEach(() => {
    seasonsRepository = new SeasonsRepositoryInMemory();
    playersRepository = new PlayersRepositoryInMemory();
    playerSeasonPointsRepository = new PlayerSeasonPointsRepositoryInMemory();
    playerTotalPointsRepository = new PlayerTotalPointsRepositoryInMemory();
    applicationLogRepository = new ApplicationLogRepositoryInMemory();
    sut = new CheckCurrentSeasonUseCase(seasonsRepository, playersRepository, playerSeasonPointsRepository, playerTotalPointsRepository, applicationLogRepository);
  });

  it("should deactivate the active season if it has ended and create a new one", async () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - (60 * 60 * 1000));

    const season = await seasonsRepository.create(makeSeason({
      endAt: pastDate,
      startAt: pastDate,
      active: true
    }));

    await sut.execute();

    const activeSeason = await seasonsRepository.findActive();
    const activeSeasonDifferenteThanOldSeason = season.id != activeSeason?.id;
    expect(activeSeasonDifferenteThanOldSeason).toBeTruthy();
  });

  // it("should activate the next season if the current one ended", async () => {
  //   const now = new Date();
  //   const pastDate = new Date(now.getTime() - (60 * 60 * 1000));
  //   const futureDate = new Date(now.getTime() + (60 * 60 * 1000));
  //   await seasonsRepository.create(makeSeason({
  //     endAt: pastDate,
  //     startAt: pastDate,
  //     active: true
  //   }));

  //   const newSeason = await seasonsRepository.create(makeSeason({
  //     endAt: futureDate,
  //     startAt: now,
  //     active: false
  //   }));

  //   await sut.execute();

  //   const activeSeason = await seasonsRepository.findActive();
  //   expect(activeSeason).not.toBeNull();
  //   expect(activeSeason?.id).toEqual(newSeason.id);
  // });

  it("should add season points to total points when a season ends", async () => {
    const endedSeason = makeSeason({
      active: true,
      startAt: new Date(Date.now() - 2 * 86400000),
      endAt: new Date(Date.now() - 86400000),
    });
    await seasonsRepository.create(endedSeason);

    const players = [
      makePlayer({ providerPlayerId: randomUUID() }),
      makePlayer({ providerPlayerId: randomUUID() }),
    ];
    for (const player of players) {
      await playersRepository.create(player);
      await playerSeasonPointsRepository.create(PlayerSeasonPoints.create({
        seasonId: endedSeason.id ?? 0,
        providerPlayerId: player.providerPlayerId ?? "",
        points: 50,
        tier: 2,
        lastTier: 3,
        progress: 0,
      }));
    }

    await sut.execute();
    for (const player of players) {
      const playerTotalPoints = await playerTotalPointsRepository.findByProviderPlayerId(player.providerPlayerId ?? "");
      expect(playerTotalPoints?.points).toEqual(50);
    }
  });
});