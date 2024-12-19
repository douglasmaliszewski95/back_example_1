import { describe, beforeEach, it, expect } from 'vitest';
import { makePlayer } from '../../../../../../../tests/factories/make-player';
import { PlayersRepositoryInMemory } from '../../../../../../../tests/repository/players-repository-in-memory';
import { ListPlayersUseCase } from '../list-players-use-case';
import { SystemRepositoryInMemory } from '../../../../../../../tests/repository/system-repository-in-memory';
import { makeSystem } from '../../../../../../../tests/factories/make-system';
import { HttpException } from '../../../../../../core/errors/HttpException';
import { SystemStatus } from '../../../../../../core/enums/system-status-enum';

let playersRepository: PlayersRepositoryInMemory;
let systemsRepository: SystemRepositoryInMemory;
let sut: ListPlayersUseCase;

describe("List players", () => {

  beforeEach(() => {
    playersRepository = new PlayersRepositoryInMemory();
    systemsRepository = new SystemRepositoryInMemory();
    sut = new ListPlayersUseCase(playersRepository, systemsRepository);
  });

  it('should be able to return a paginated list of players', async () => {
    const player = makePlayer();
    await playersRepository.create(player);
    const system = makeSystem({
      status: SystemStatus.ACTIVE
    });
    systemsRepository.create(system);

    const response = await sut.execute(system.systemId, {
      page: 1,
      limit: 10,
    });

    expect(response.list).toHaveLength(1);
  });

  it('should return a empty list if there is no players to return', async () => {
    const system = makeSystem({
      status: SystemStatus.ACTIVE
    });
    systemsRepository.create(system);
    const response = await sut.execute(system.systemId, {
      page: 1,
      limit: 10,
    });

    expect(response.list).toHaveLength(0);
  });

  it("should be able to paginate the list of players", async () => {
    const system = makeSystem({
      status: SystemStatus.ACTIVE
    });
    systemsRepository.create(system);
    for (let i = 0; i < 30; i++) {
      const player = makePlayer({
        supabaseEmail: `test-${i}@email.com`
      });
      await playersRepository.create(player);
    }

    const response = await sut.execute(system.systemId, {
      page: 2,
      limit: 10,
    });

    expect(response.total).toEqual(30);
    expect(response.list).toEqual([
      expect.objectContaining({ email: 'test-10@email.com' }),
      expect.objectContaining({ email: 'test-11@email.com' }),
      expect.objectContaining({ email: 'test-12@email.com' }),
      expect.objectContaining({ email: 'test-13@email.com' }),
      expect.objectContaining({ email: 'test-14@email.com' }),
      expect.objectContaining({ email: 'test-15@email.com' }),
      expect.objectContaining({ email: 'test-16@email.com' }),
      expect.objectContaining({ email: 'test-17@email.com' }),
      expect.objectContaining({ email: 'test-18@email.com' }),
      expect.objectContaining({ email: 'test-19@email.com' }),
    ]);
  });

  it("should be able to filter the list of players by params", async () => {
    const system = makeSystem({
      status: SystemStatus.ACTIVE
    });
    systemsRepository.create(system);
    for (let i = 0; i < 10; i++) {
      const player = makePlayer({
        supabaseEmail: `test-${i}@email.com`
      });
      await playersRepository.players.push(player);
    }

    const response = await sut.execute(system.systemId, {
      page: 1,
      limit: 10,
      email: "test-1@email.com"
    });

    expect(response.list).toHaveLength(1);
  });

  it('should not be able to fetch list of users with invalid system', async () => {
    await expect(sut.execute("", {
      page: 1,
      limit: 10,
    })).rejects.toBeInstanceOf(HttpException);
  });

  it('should not be able to fetch list of users with a not Active system', async () => {
    const system = makeSystem();
    systemsRepository.create(system);

    await expect(sut.execute(system.systemId, {
      page: 1,
      limit: 10,
    })).rejects.toBeInstanceOf(HttpException);
  });
});