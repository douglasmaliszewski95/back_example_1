import { beforeEach, describe, it, expect } from 'vitest';
import { PlayersRepositoryInMemory } from '../../../../../../tests/repository/players-repository-in-memory';
import { FakeAuthPlayerProvider } from '../../../../../../tests/auth-provider/fake-auth-player-provider';
import { FakeCampaignsGateway } from '../../../../../../tests/gateway/fake-campaigns-gateway';
import { GetPlayerGalxeInfoUseCase } from '../get-player-galxe-info-use-case';
import { makePlayer } from '../../../../../../tests/factories/make-player';
import { randomUUID } from 'node:crypto';
import { HttpException } from '../../../../../core/errors/HttpException';

let campaignsGateway: FakeCampaignsGateway;
let playersRepository: PlayersRepositoryInMemory;
let authPlayerProvider: FakeAuthPlayerProvider;
let sut: GetPlayerGalxeInfoUseCase;

describe("Get Campaigns and Quests", () => {
  beforeEach(() => {
    campaignsGateway = new FakeCampaignsGateway()
    playersRepository = new PlayersRepositoryInMemory();
    authPlayerProvider = new FakeAuthPlayerProvider();
    sut = new GetPlayerGalxeInfoUseCase(
      campaignsGateway,
      playersRepository,
      authPlayerProvider,
    );
  });

  it("should be able to update a user with galxe info", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID(),
      password: 'test-password'
    });

    await authPlayerProvider.signup(player);
    await playersRepository.create(player);

    const auth = await authPlayerProvider.signin({
      email: player.email,
      password: 'test-password'
    });

    const response = await sut.execute(auth.token, "code-test");

    expect(response.player.galxeId).toEqual("code-test")
  })

  it("should not be able to update a inexistent player", async () => {
    await expect(sut.execute("", "code-test")).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to update a user with an already used galxe id", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID(),
      password: 'test-password'
    });

    await authPlayerProvider.signup(player);
    await playersRepository.create(player);
    await playersRepository.create(makePlayer({
      providerPlayerId: randomUUID(),
      password: 'test-password',
      galxeId: 'test-galxe-id'
    }));

    const auth = await authPlayerProvider.signin({
      email: player.email,
      password: 'test-password'
    });

    await expect(sut.execute(auth.token, "test-galxe-id")).rejects.toBeInstanceOf(HttpException);
  });
});