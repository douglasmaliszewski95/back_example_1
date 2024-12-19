import { beforeEach, describe, expect, it } from 'vitest';
import { PlayerSeasonPointsRepositoryInMemory } from '../../../../../../tests/repository/player-season-points-repository-in-memory';
import { SeasonsRepositoryInMemory } from '../../../../../../tests/repository/seasons-repository-in-memory';
import { SeasonLeaderboardsUseCase } from '../season-leaderboards-use-case';
import { makeSeason } from '../../../../../../tests/factories/make-season';
import { randomUUID } from 'crypto';
import { PlayerSeasonPoints } from '../../../enterprise/entities/player-season-points';
import { HttpException } from '../../../../../core/errors/HttpException';

let seasonsRepository: SeasonsRepositoryInMemory;
let playerPointsRepository: PlayerSeasonPointsRepositoryInMemory;
let sut: SeasonLeaderboardsUseCase;

describe("Create a season", () => {
  beforeEach(() => {
    seasonsRepository = new SeasonsRepositoryInMemory();
    playerPointsRepository = new PlayerSeasonPointsRepositoryInMemory();
    sut = new SeasonLeaderboardsUseCase(playerPointsRepository);
  });

  it("should be able to return season leaderboards", async () => {
    seasonsRepository.seasons.push(makeSeason({
      name: 'Summer Test 2024',
      description: 'Summer test season for incredbull',
      active: true,
      startAt: new Date('2024-06-01'),
      endAt: new Date('2024-08-31'),
      id: 1
    }));

    for (let i = 0; i <= 30; i++) {
      await playerPointsRepository.create(PlayerSeasonPoints.create({
        points: 15 * i,
        providerPlayerId: randomUUID(),
        tier: 3,
        lastTier: 3,
        seasonId: 1,
        progress: 0
      }));
    }

    const response = await sut.execute({
      limit: 30,
      page: 1
    });

    expect(response.items.length).toEqual(30)
  });
});