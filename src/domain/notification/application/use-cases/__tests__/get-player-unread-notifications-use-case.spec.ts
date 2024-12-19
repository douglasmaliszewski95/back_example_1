import { beforeEach, describe, expect, it } from "vitest";
import { NotificationsRegistryRepositoryInMemory } from "../../../../../../tests/repository/notifications-registry-repository-in-memory";
import { PlayersRepositoryInMemory } from "../../../../../../tests/repository/players-repository-in-memory";
import { FakeAuthPlayerProvider } from "../../../../../../tests/auth-provider/fake-auth-player-provider";
import { makePlayer } from "../../../../../../tests/factories/make-player";
import { makeNotificationRegistry } from "../../../../../../tests/factories/make-notification-registry";
import { GetPlayerUnreadNotificationsUseCase } from "../get-player-unread-notifications-use-case";

let notificationsRegistryRepository: NotificationsRegistryRepositoryInMemory;
let playersRepository: PlayersRepositoryInMemory;
let authPlayerProvider: FakeAuthPlayerProvider;
let sut: GetPlayerUnreadNotificationsUseCase;

describe("Get player unread notifications", () => {
  beforeEach(() => {
    notificationsRegistryRepository = new NotificationsRegistryRepositoryInMemory();
    playersRepository = new PlayersRepositoryInMemory();
    authPlayerProvider = new FakeAuthPlayerProvider();
    sut = new GetPlayerUnreadNotificationsUseCase(
      notificationsRegistryRepository,
      playersRepository,
      authPlayerProvider
    );
  });

  it("should be able to get the total of unread notifications for a player", async () => {
    const player = makePlayer({
      email: "test@test.com",
      password: "teste123",
      providerPlayerId: "123"
    });
    for (let i = 1; i <= 5; i++) {
      const notificationRegistry = makeNotificationRegistry({
        notificationId: i,
        recipientId: player.providerPlayerId,
        isRead: false,
        isDeleted: false
      });
      await notificationsRegistryRepository.create(notificationRegistry);
    }
    await authPlayerProvider.signup(player);
    await playersRepository.create(player);
    const auth = await authPlayerProvider.signin({
      email: player.email,
      password: player.password as string
    });

    const response = await sut.execute(auth.token);

    expect(response.total).toBe(5);
    expect(response.hasUnread).toBe(true);
  });
});
