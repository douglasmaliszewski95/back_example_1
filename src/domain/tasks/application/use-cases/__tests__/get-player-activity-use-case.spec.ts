import { beforeEach, describe, it, expect } from 'vitest';
import { PlayerSeasonPointsRepositoryInMemory } from '../../../../../../tests/repository/player-season-points-repository-in-memory';
import { PlayersRepositoryInMemory } from '../../../../../../tests/repository/players-repository-in-memory';
import { SeasonsRepositoryInMemory } from '../../../../../../tests/repository/seasons-repository-in-memory';
import { TaskRepositoryInMemory } from '../../../../../../tests/repository/task-repository-in-memory';
import { GetPlayerActivityUseCase } from '../get-player-activity-use-case';
import { makeCompletedTask } from '../../../../../../tests/factories/make-completed-task';
import { makeSeason } from '../../../../../../tests/factories/make-season';
import { randomUUID } from 'node:crypto';
import { makePlayer } from '../../../../../../tests/factories/make-player';
import { PlayerTotalPointsRepositoryInMemory } from '../../../../../../tests/repository/player-total-points-repository-in-memory';

let tasksRepository: TaskRepositoryInMemory;
let playersRepository: PlayersRepositoryInMemory;
let seasonsRepository: SeasonsRepositoryInMemory;
let playerTotalPointsRepository: PlayerTotalPointsRepositoryInMemory;
let sut: GetPlayerActivityUseCase;

describe("Create completed task", () => {
  beforeEach(() => {
    playersRepository = new PlayersRepositoryInMemory();
    tasksRepository = new TaskRepositoryInMemory();
    seasonsRepository = new SeasonsRepositoryInMemory();
    playerTotalPointsRepository = new PlayerTotalPointsRepositoryInMemory();
    sut = new GetPlayerActivityUseCase(playersRepository, tasksRepository, seasonsRepository, playerTotalPointsRepository);
  });

  it("should be able to return all players activities", async () => {
    const season = await seasonsRepository.create(makeSeason({
      name: 'Summer Test 2024',
      description: 'Summer test season for incredbull',
      active: true,
      startAt: new Date('2024-06-01'),
      endAt: new Date('2024-08-31')
    }));

    for (let i = 0; i < 30; i++) {
      await tasksRepository.create(makeCompletedTask({
        name: `test-${i}`,
        points: i,
        seasonId: season.id,
        createdAt: new Date()
      }));
    }

    const response = await sut.execute({
      limit: 10,
      page: 1
    });

    expect(response.total).toEqual(10);
  });

  it("should be able to return paginated player activities", async () => {
    const season = await seasonsRepository.create(makeSeason({
      name: 'Summer Test 2024',
      description: 'Summer test season for incredbull',
      active: true,
      startAt: new Date('2024-06-01'),
      endAt: new Date('2024-08-31')
    }));
    const providerPlayerId = randomUUID();
    await playersRepository.create(makePlayer({
      providerPlayerId: providerPlayerId,
      username: 'test-user'
    }));

    for (let i = 0; i < 30; i++) {
      await tasksRepository.tasks.push(makeCompletedTask({
        name: `test-${i}`,
        points: i,
        seasonId: season.id,
        createdAt: new Date(),
        providerPlayerId: providerPlayerId
      }));
    }

    const response = await sut.execute({
      limit: 10,
      page: 1,
      username: 'test-user'
    });

    expect(response.items.length).toEqual(1);
  });
});