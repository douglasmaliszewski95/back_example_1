import { beforeEach, describe, it, expect } from 'vitest';
import { randomUUID } from 'node:crypto';
import { makePlayer } from '../../../../../../tests/factories/make-player';
import { makeSeason } from '../../../../../../tests/factories/make-season';
import { makeSystem } from '../../../../../../tests/factories/make-system';
import { PlayerSeasonPointsRepositoryInMemory } from '../../../../../../tests/repository/player-season-points-repository-in-memory';
import { PlayerTotalPointsRepositoryInMemory } from '../../../../../../tests/repository/player-total-points-repository-in-memory';
import { PlayersRepositoryInMemory } from '../../../../../../tests/repository/players-repository-in-memory';
import { SeasonsRepositoryInMemory } from '../../../../../../tests/repository/seasons-repository-in-memory';
import { SystemRepositoryInMemory } from '../../../../../../tests/repository/system-repository-in-memory';
import { TaskRepositoryInMemory } from '../../../../../../tests/repository/task-repository-in-memory';
import { SystemStatus } from '../../../../../core/enums/system-status-enum';
import { HttpException } from '../../../../../core/errors/HttpException';
import { CreateCompletedTaskUseCase } from '../create-completed-task-use-case';

let tasksRepository: TaskRepositoryInMemory;
let playersRepository: PlayersRepositoryInMemory;
let systemsRepository: SystemRepositoryInMemory;
let playerSeasonRepository: PlayerSeasonPointsRepositoryInMemory;
let playerTotalPointsRepository: PlayerTotalPointsRepositoryInMemory;
let seasonsRepository: SeasonsRepositoryInMemory;
let sut: CreateCompletedTaskUseCase;

describe("Create completed task", () => {
  beforeEach(() => {
    tasksRepository = new TaskRepositoryInMemory();
    playersRepository = new PlayersRepositoryInMemory();
    systemsRepository = new SystemRepositoryInMemory();
    playerSeasonRepository = new PlayerSeasonPointsRepositoryInMemory();
    playerTotalPointsRepository = new PlayerTotalPointsRepositoryInMemory();
    seasonsRepository = new SeasonsRepositoryInMemory();
    sut = new CreateCompletedTaskUseCase(tasksRepository, playersRepository, systemsRepository, playerSeasonRepository, playerTotalPointsRepository, seasonsRepository);
  });

  it("should be able to create completed task", async () => {
    const system = makeSystem({
      status: SystemStatus.ACTIVE
    });
    await systemsRepository.create(system);
    const player = makePlayer({
      providerPlayerId: randomUUID(),
    });
    await playersRepository.create(player);

    await seasonsRepository.create(makeSeason({
      name: 'Summer Test 2024',
      description: 'Summer test season for incredbull',
      active: true,
      startAt: new Date('2024-06-01'),
      endAt: new Date('2024-08-31')
    }));

    const response = await sut.execute(system.systemId, {
      completedDate: new Date(),
      description: 'description test',
      name: 'name test',
      points: 40,
      providerPlayerId: player.providerPlayerId ?? "",
      taskId: randomUUID(),
    });

    expect(response.name).toEqual('name test');
  });

  it("should not be able to create a completed task with a invalid system", async () => {
    await expect(sut.execute("", {
      completedDate: new Date(),
      description: 'description test',
      name: 'name test',
      points: 40,
      providerPlayerId: "",
      taskId: randomUUID(),
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to create completed task with a system that is not active", async () => {
    const system = makeSystem();
    await systemsRepository.create(system);
    await expect(sut.execute(system.systemId, {
      completedDate: new Date(),
      description: 'description test',
      name: 'name test',
      points: 40,
      providerPlayerId: "",
      taskId: randomUUID(),
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to create a completed task with a invalid user", async () => {
    const system = makeSystem({
      status: SystemStatus.ACTIVE
    });
    await systemsRepository.create(system);

    await expect(sut.execute(system.systemId, {
      completedDate: new Date(),
      description: 'description test',
      name: 'name test',
      points: 40,
      providerPlayerId: "",
      taskId: randomUUID(),
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to create a completed task with zero or negative points", async () => {
    const system = makeSystem({
      status: SystemStatus.ACTIVE
    });
    await systemsRepository.create(system);
    const player = makePlayer({
      providerPlayerId: randomUUID(),
    });
    await playersRepository.create(player);

    await expect(sut.execute(system.systemId, {
      completedDate: new Date(),
      description: 'description test',
      name: 'name test',
      points: 0,
      providerPlayerId: player.providerPlayerId ?? "",
      taskId: randomUUID(),
    })).rejects.toBeInstanceOf(HttpException);

    await expect(sut.execute(system.systemId, {
      completedDate: new Date(),
      description: 'description test',
      name: 'name test',
      points: -10,
      providerPlayerId: player.providerPlayerId ?? "",
      taskId: randomUUID(),
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to create a completed task when no active season is available", async () => {
    const system = makeSystem({
      status: SystemStatus.ACTIVE
    });
    await systemsRepository.create(system);
    const player = makePlayer({
      providerPlayerId: randomUUID(),
    });
    await playersRepository.create(player);

    await expect(sut.execute(system.systemId, {
      completedDate: new Date(),
      description: 'description test',
      name: 'name test',
      points: 40,
      providerPlayerId: player.providerPlayerId ?? "",
      taskId: randomUUID(),
    })).rejects.toBeInstanceOf(HttpException);
  });
});