import { beforeEach, describe, expect, it } from "vitest";
import { HttpException } from "../../../../../core/errors/HttpException";
import { DeletePlayerNotificationUseCase } from "../delete-player-notification-use-case";
import { NotificationsRegistryRepositoryInMemory } from "../../../../../../tests/repository/notifications-registry-repository-in-memory";
import { PlayersRepositoryInMemory } from "../../../../../../tests/repository/players-repository-in-memory";
import { FakeAuthPlayerProvider } from "../../../../../../tests/auth-provider/fake-auth-player-provider";
import { makePlayer } from "../../../../../../tests/factories/make-player";
import { makeNotificationRegistry } from "../../../../../../tests/factories/make-notification-registry";

let notificationsRegistryRepository: NotificationsRegistryRepositoryInMemory;
let playersRepository: PlayersRepositoryInMemory;
let authPlayerProvider: FakeAuthPlayerProvider;
let sut: DeletePlayerNotificationUseCase;

describe("Delete player notification", () => {
  beforeEach(() => {
    notificationsRegistryRepository = new NotificationsRegistryRepositoryInMemory();
    playersRepository = new PlayersRepositoryInMemory();
    authPlayerProvider = new FakeAuthPlayerProvider();
    sut = new DeletePlayerNotificationUseCase(notificationsRegistryRepository, playersRepository, authPlayerProvider);
  });

  it("should be able to logically delete a player notification registry by notificationId", async () => {
    const player = makePlayer({
      email: "test@test.com",
      password: "teste123",
      providerPlayerId: "123"
    });
    const notificationRegistry = makeNotificationRegistry({
      notificationId: 1,
      recipientId: player.providerPlayerId,
      isDeleted: false
    });
    await authPlayerProvider.signup(player);
    await playersRepository.create(player);
    await notificationsRegistryRepository.create(notificationRegistry);
    const auth = await authPlayerProvider.signin({
      email: player.email,
      password: player.password as string
    });

    await sut.execute(auth.token, notificationRegistry.notificationId);

    expect(notificationsRegistryRepository.notificationRegistry[0].isDeleted).toBe(true);
  });

  it("should throw a exception if player notification registry was not found", async () => {
    const player = makePlayer({
      email: "test@test.com",
      password: "teste123",
      providerPlayerId: "123"
    });
    await authPlayerProvider.signup(player);
    await playersRepository.create(player);
    const auth = await authPlayerProvider.signin({
      email: player.email,
      password: player.password as string
    });

    try {
      await sut.execute(auth.token, 0);
    } catch (error: any) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error?.message).toBe("Notification not found");
    }
  });
});
