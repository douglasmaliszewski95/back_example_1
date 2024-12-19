import { beforeEach, describe, expect, it } from 'vitest';
import { SeasonsRepositoryInMemory } from '../../../../../../tests/repository/seasons-repository-in-memory';
import { makeSeason } from '../../../../../../tests/factories/make-season';
import { PlayerSeasonPointsRepositoryInMemory } from '../../../../../../tests/repository/player-season-points-repository-in-memory';
import { RecalculateAllPlayersASeasonTierUseCase } from '../recalculate-all-players-season-tier-use-case';
import { makePlayerSeasonPoints } from '../../../../../../tests/factories/make-player-season-points';

let seasonsRepository: SeasonsRepositoryInMemory;
let playerPointsRepository: PlayerSeasonPointsRepositoryInMemory;
let sut: RecalculateAllPlayersASeasonTierUseCase;

describe("Create a season", () => {
  beforeEach(() => {
    seasonsRepository = new SeasonsRepositoryInMemory();
    playerPointsRepository = new PlayerSeasonPointsRepositoryInMemory();
    sut = new RecalculateAllPlayersASeasonTierUseCase(seasonsRepository, playerPointsRepository);
  });

  it("should set all players to tier 3 if they all have the same points", async () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (60 * 60 * 1000));

    const season = await seasonsRepository.create(makeSeason({
      endAt: futureDate,
      startAt: now,
      active: true
    }));

    for (let i = 0; i < 30; i++) {
      const playerPoint = makePlayerSeasonPoints({ seasonId: season.id, points: 100, id: i });
      await playerPointsRepository.playerPoints.push(playerPoint);
    }

    await sut.execute();

    for (const playerPoint of playerPointsRepository.playerPoints) {
      expect(playerPoint.tier).toBe(3);
    }
  });

  it("should recalculate and assign tiers correctly", async () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (60 * 60 * 1000));

    const season = await seasonsRepository.create(makeSeason({
      endAt: futureDate,
      startAt: now,
      active: true
    }));

    for (let i = 0; i < 30; i++) {
      const playerPoint = makePlayerSeasonPoints({ seasonId: season.id, points: 5 * i, tier: 3, id: i });
      await playerPointsRepository.playerPoints.push(playerPoint);
    }

    await sut.execute();
    const tier1Quantity = playerPointsRepository.playerPoints.filter(pp => pp.tier === 1).length;
    const tier2Quantity = playerPointsRepository.playerPoints.filter(pp => pp.tier === 2).length;
    const tier3Quantity = playerPointsRepository.playerPoints.filter(pp => pp.tier === 3).length;

    expect(tier1Quantity).toBe(7);
    expect(tier2Quantity).toBe(7);
    expect(tier3Quantity).toBe(16);
  });

  it("should do nothing if no active season is found", async () => {
    const playersPoints = [
      makePlayerSeasonPoints({ id: 1, seasonId: 1, points: 300, tier: 3 }),
      makePlayerSeasonPoints({ id: 2, seasonId: 1, points: 200, tier: 3 })
    ];

    playerPointsRepository.playerPoints = playersPoints;

    await sut.execute();

    expect(playersPoints[0].tier).toBe(3);
    expect(playersPoints[1].tier).toBe(3);
  });
});