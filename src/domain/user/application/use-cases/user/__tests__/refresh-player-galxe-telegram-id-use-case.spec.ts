import { beforeEach, describe, it, expect, vi } from 'vitest';
import { RefreshPlayerGalxeTelegramIdUseCase } from '../refresh-player-galxe-telegram-id-use-case';
import { FakeAuthPlayerProvider } from '../../../../../../../tests/auth-provider/fake-auth-player-provider';
import { FakeCampaignsGateway } from '../../../../../../../tests/gateway/fake-campaigns-gateway';
import { PlayersRepositoryInMemory } from '../../../../../../../tests/repository/players-repository-in-memory';
import { randomUUID } from 'crypto';
import { makePlayer } from '../../../../../../../tests/factories/make-player';
import { HttpException } from '../../../../../../core/errors/HttpException';
import { GetGalxeUserDetailedInformationResponseDTO } from '../../../../../campaign/application/gateway/campaign-gateway.types';

let campaignsGateway: FakeCampaignsGateway;
let playersRepository: PlayersRepositoryInMemory;
let authPlayerProvider: FakeAuthPlayerProvider;
let sut: RefreshPlayerGalxeTelegramIdUseCase;

describe("Get Campaigns and Quests", () => {
  beforeEach(() => {
    campaignsGateway = new FakeCampaignsGateway()
    playersRepository = new PlayersRepositoryInMemory();
    authPlayerProvider = new FakeAuthPlayerProvider();
    sut = new RefreshPlayerGalxeTelegramIdUseCase(
      campaignsGateway,
      playersRepository,
      authPlayerProvider,
    );
  });

  it("should be able to get telegram Id from galxe and link it to user", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID(),
      password: 'test-password',
      galxeId: "galxe-id"
    });

    await authPlayerProvider.signup(player);
    await playersRepository.create(player);
    const { token } = await authPlayerProvider.signin({
      email: player.email,
      password: player.password || ""
    });

    const response = await sut.execute(token);
    expect(response.galxeTelegramId).toBeDefined();
  });

  it("should not be able to get telegram id if galxe is not already linked", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID(),
      password: 'test-password',
    });

    await authPlayerProvider.signup(player);
    await playersRepository.create(player);
    const { token } = await authPlayerProvider.signin({
      email: player.email,
      password: player.password || ""
    });

    await expect(sut.execute(token)).rejects.toBeInstanceOf(HttpException);;
  });

  it("should not be able to link telegram id if galxe dont return telegram id", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID(),
      password: 'test-password',
      galxeId: "galxe-id"
    });

    await authPlayerProvider.signup(player);
    await playersRepository.create(player);
    const { token } = await authPlayerProvider.signin({
      email: player.email,
      password: player.password || "",
    });

    const mockResponse: GetGalxeUserDetailedInformationResponseDTO = {
      id: "galxe-id",
      username: "galxe-username",
      hasDiscord: true,
      discordUserID: "discord-id",
      hasTelegram: true,
      telegramUserID: "",
      hasTwitter: true,
      twitterUserID: "twitter-id",
      email: "email"
    };
    vi.spyOn(campaignsGateway, 'getGalxeUserDetailedInformation').mockResolvedValue(mockResponse);

    await expect(sut.execute(token)).rejects.toBeInstanceOf(HttpException);
  });
});