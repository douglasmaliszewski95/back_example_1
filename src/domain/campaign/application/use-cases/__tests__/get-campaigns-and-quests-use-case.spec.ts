import { beforeEach, describe, it, expect } from 'vitest';
import { randomUUID } from 'node:crypto';
import { FakeAuthPlayerProvider } from '../../../../../../tests/auth-provider/fake-auth-player-provider';
import { makePlayer } from '../../../../../../tests/factories/make-player';
import { makeSeason } from '../../../../../../tests/factories/make-season';
import { PlayerSeasonPointsRepositoryInMemory } from '../../../../../../tests/repository/player-season-points-repository-in-memory';
import { PlayerTotalPointsRepositoryInMemory } from '../../../../../../tests/repository/player-total-points-repository-in-memory';
import { SeasonsRepositoryInMemory } from '../../../../../../tests/repository/seasons-repository-in-memory';
import { TaskRepositoryInMemory } from '../../../../../../tests/repository/task-repository-in-memory';
import { HttpException } from '../../../../../core/errors/HttpException';
import { GetCampaignsAndQuestsUseCase } from '../get-campaigns-and-quests-use-case';
import { FakeCampaignsGateway } from '../../../../../../tests/gateway/fake-campaigns-gateway';
import { CampaignsAndQuestsMocks } from '../../../../../../tests/mocks/campaigns-and-quests-mock';
import { makePlayerSeasonPoints } from '../../../../../../tests/factories/make-player-season-points';
import { makeCompletedTask } from '../../../../../../tests/factories/make-completed-task';
import { PlayerTotalPoints } from '../../../../season/enterprise/entities/player-total-points';
import { PlayersRepositoryInMemory } from '../../../../../../tests/repository/players-repository-in-memory';

let campaignsGateway: FakeCampaignsGateway;
let authPlayerProvider: FakeAuthPlayerProvider;
let playersRepository: PlayersRepositoryInMemory;
let tasksRepository: TaskRepositoryInMemory;
let seasonsRepository: SeasonsRepositoryInMemory;
let playerSeasonRepository: PlayerSeasonPointsRepositoryInMemory;
let playerTotalPointsRepository: PlayerTotalPointsRepositoryInMemory;
let sut: GetCampaignsAndQuestsUseCase;

describe("Get Campaigns and Quests", () => {
  beforeEach(() => {
    campaignsGateway = new FakeCampaignsGateway()
    authPlayerProvider = new FakeAuthPlayerProvider();
    playersRepository = new PlayersRepositoryInMemory();
    tasksRepository = new TaskRepositoryInMemory();
    playerSeasonRepository = new PlayerSeasonPointsRepositoryInMemory();
    playerTotalPointsRepository = new PlayerTotalPointsRepositoryInMemory();
    seasonsRepository = new SeasonsRepositoryInMemory();
    sut = new GetCampaignsAndQuestsUseCase(
      campaignsGateway,
      authPlayerProvider,
      playersRepository,
      tasksRepository,
      seasonsRepository,
      playerSeasonRepository,
      playerTotalPointsRepository,
    );
  });

  it("should be able to get campaigns and quests", async () => {
    await authPlayerProvider.signup(makePlayer({
      email: "test@test.com",
      password: "teste123"
    }));
    const auth = await authPlayerProvider.signin({
      email: "test@test.com",
      password: "teste123"
    });
    await seasonsRepository.create(makeSeason({
      active: true
    }));
    const response = await sut.execute(auth.token);

    expect(response).toEqual(CampaignsAndQuestsMocks.listCampaignsAndQuests());
  });

  it("should throw Unauthorized error if user is not signed in", async () => {
    await expect(sut.execute("invalid_token")).rejects.toBeInstanceOf(HttpException);
  });

  it("should throw Unprocessable Entity error if there is no active season", async () => {
    await authPlayerProvider.signup(makePlayer({
      email: "test@test.com",
      password: "teste123"
    }));
    await authPlayerProvider.signin({
      email: "test@test.com",
      password: "teste123"
    });

    await expect(sut.execute("valid_token")).rejects.toBeInstanceOf(HttpException);
  });

  it("should calculate points correctly for completed tasks", async () => {
    const player = await authPlayerProvider.signup(makePlayer({
      email: "test@test.com",
      password: "teste123",
      providerPlayerId: randomUUID()
    }));
    const auth = await authPlayerProvider.signin({
      email: "test@test.com",
      password: "teste123"
    });
    const season = await seasonsRepository.create(makeSeason({ active: true }));
    await sut.execute(auth.token);

    const seasonPoints = await playerSeasonRepository.findBySeasonAndProviderPlayerId(season.id ?? 0, player.data?.providerPlayerId ?? "");
    const totalPoints = await playerTotalPointsRepository.findByProviderPlayerId(player.data?.providerPlayerId ?? "");
    expect(seasonPoints?.points).toEqual(25);
    expect(totalPoints?.points).toEqual(25);
  });

  it("should not add points from a already credited task", async () => {
    const player = await authPlayerProvider.signup(makePlayer({
      email: "test@test.com",
      password: "teste123",
      providerPlayerId: randomUUID()
    }));
    const auth = await authPlayerProvider.signin({
      email: "test@test.com",
      password: "teste123"
    });
    const season = await seasonsRepository.create(makeSeason({ active: true }));
    await tasksRepository.create(makeCompletedTask({
      taskId: '2863260006',
      providerPlayerId: player.data?.providerPlayerId,
      seasonId: season.id,
      points: 25
    }));

    await playerSeasonRepository.create(makePlayerSeasonPoints({
      providerPlayerId: player.data?.providerPlayerId,
      seasonId: season.id,
      points: 25
    }));
    await playerTotalPointsRepository.create(PlayerTotalPoints.create({
      points: 25,
      providerPlayerId: player.data?.providerPlayerId ?? "",
      tier: 3,
      tierLastUpdatedTime: new Date(),
      progress: 0
    }))
    await sut.execute(auth.token);

    const seasonPoints = await playerSeasonRepository.findBySeasonAndProviderPlayerId(season.id ?? 0, player.data?.providerPlayerId ?? "");
    const totalPoints = await playerTotalPointsRepository.findByProviderPlayerId(player.data?.providerPlayerId ?? "");
    expect(seasonPoints?.points).toEqual(25);
    expect(totalPoints?.points).toEqual(25);
  });
});