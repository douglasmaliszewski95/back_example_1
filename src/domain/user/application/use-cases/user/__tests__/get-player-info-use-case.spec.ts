import { describe, beforeEach, it, expect } from "vitest";
import { FakeAuthPlayerProvider } from "../../../../../../../tests/auth-provider/fake-auth-player-provider";
import { makePlayer } from "../../../../../../../tests/factories/make-player";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { HttpException } from "../../../../../../core/errors/HttpException";
import { GetPlayerInfoUseCase } from "../get-player-info-use-case";
import { PlayerSeasonPointsRepositoryInMemory } from "../../../../../../../tests/repository/player-season-points-repository-in-memory";
import { PlayerTotalPointsRepositoryInMemory } from "../../../../../../../tests/repository/player-total-points-repository-in-memory";
import { SeasonsRepositoryInMemory } from "../../../../../../../tests/repository/seasons-repository-in-memory";
import { makeSeason } from "../../../../../../../tests/factories/make-season";
import { PlayerSeasonPoints } from "../../../../../season/enterprise/entities/player-season-points";
import { randomUUID } from "crypto";
import { PlayerTotalPoints } from "../../../../../season/enterprise/entities/player-total-points";
import { TaskRepositoryInMemory } from "../../../../../../../tests/repository/task-repository-in-memory";

let authProvider: FakeAuthPlayerProvider;
let usersRepository: PlayersRepositoryInMemory;
let playerSeasonPointsRepository: PlayerSeasonPointsRepositoryInMemory;
let playerTotalPointsRepository: PlayerTotalPointsRepositoryInMemory;
let seasonsRepository: SeasonsRepositoryInMemory;
let tasksRepository: TaskRepositoryInMemory;
let sut: GetPlayerInfoUseCase;

describe("Get Player Info", () => {
  beforeEach(() => {
    authProvider = new FakeAuthPlayerProvider();
    usersRepository = new PlayersRepositoryInMemory();
    playerSeasonPointsRepository = new PlayerSeasonPointsRepositoryInMemory();
    playerTotalPointsRepository = new PlayerTotalPointsRepositoryInMemory();
    seasonsRepository = new SeasonsRepositoryInMemory();
    tasksRepository = new TaskRepositoryInMemory();
    sut = new GetPlayerInfoUseCase(authProvider, usersRepository, playerSeasonPointsRepository, playerTotalPointsRepository, seasonsRepository, tasksRepository);
  });

  it("should be able to retrieve a player info", async () => {
    await seasonsRepository.create(makeSeason({
      name: 'Summer Test 2024',
      description: 'Summer test season for incredbull',
      active: true,
      startAt: new Date('2024-06-01'),
      endAt: new Date('2024-08-31')
    }));

    const player = makePlayer();
    await authProvider.signup(player);
    const { token } = await authProvider.signin({
      email: player.email,
      password: player.password || ""
    });

    const response = await sut.execute({
      token: `Bearer ${token}`
    });

    expect(response?.supabaseEmail).toEqual(player.email);
    expect(response?.seasonPoints.points).toEqual(0);
    expect(response?.totalPoints.points).toEqual(0);
  });

  it("should not create a new season and points register if it already exists", async () => {
    const season = await seasonsRepository.create(makeSeason({
      name: 'Summer Test 2024',
      description: 'Summer test season for incredbull',
      active: true,
      startAt: new Date('2024-06-01'),
      endAt: new Date('2024-08-31')
    }));

    const player = makePlayer({
      providerPlayerId: randomUUID()
    });
    const createdUser = await authProvider.signup(player);
    await playerSeasonPointsRepository.create(PlayerSeasonPoints.create({
      points: 50,
      providerPlayerId: createdUser.data?.providerPlayerId ?? randomUUID(),
      seasonId: season.id ?? 0,
      tier: 3,
      lastTier: 3,
      progress: 0
    }));
    await playerTotalPointsRepository.create(PlayerTotalPoints.create({
      points: 100,
      providerPlayerId: createdUser.data?.providerPlayerId ?? randomUUID(),
      tierLastUpdatedTime: new Date(),
      tier: 3,
      progress: 0
    }));
    const { token } = await authProvider.signin({
      email: player.email,
      password: player.password || ""
    });

    const response = await sut.execute({
      token: `Bearer ${token}`
    });

    expect(response?.supabaseEmail).toEqual(player.email);
    expect(response?.seasonPoints.points).toEqual(50);
    expect(response?.totalPoints.points).toEqual(100);
  });

  it("should not be able to find a player without a id", async () => {
    await expect(sut.execute({ token: "" })).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to find a non-existing user by id", async () => {
    await expect(sut.execute({ token: "test-token" })).rejects.toBeInstanceOf(HttpException);
  });
});
