import { beforeEach, describe, expect, it } from 'vitest';
import { AllTimeLeaderboardsUseCase } from '../all-time-leaderboards-use-case';
import { PlayerTotalPointsRepositoryInMemory } from '../../../../../../tests/repository/player-total-points-repository-in-memory';
import { randomUUID } from 'crypto';
import { PlayerTotalPoints } from '../../../enterprise/entities/player-total-points';

let playerTotalPointsRepository: PlayerTotalPointsRepositoryInMemory
let sut: AllTimeLeaderboardsUseCase;

describe("Create a season", () => {
  beforeEach(() => {
    playerTotalPointsRepository = new PlayerTotalPointsRepositoryInMemory();
    sut = new AllTimeLeaderboardsUseCase(playerTotalPointsRepository);
  });

  it("should be able to return season leaderboards", async () => {

    for (let i = 0; i <= 30; i++) {
      await playerTotalPointsRepository.create(PlayerTotalPoints.create({
        points: 15 * i,
        providerPlayerId: randomUUID(),
        tier: 3,
        tierLastUpdatedTime: new Date(),
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