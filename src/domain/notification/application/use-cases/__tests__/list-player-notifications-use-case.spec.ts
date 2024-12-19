import { beforeEach, describe, expect, it } from "vitest";
import { NotificationsRegistryRepositoryInMemory } from "../../../../../../tests/repository/notifications-registry-repository-in-memory";
import { PlayersRepositoryInMemory } from "../../../../../../tests/repository/players-repository-in-memory";
import { FakeAuthPlayerProvider } from "../../../../../../tests/auth-provider/fake-auth-player-provider";
import { makePlayer } from "../../../../../../tests/factories/make-player";
import { makeNotificationRegistry } from "../../../../../../tests/factories/make-notification-registry";
import { ListPlayerNotificationsUseCase } from "../list-player-notifications-use-case";

let notificationsRegistryRepository: NotificationsRegistryRepositoryInMemory;
let playersRepository: PlayersRepositoryInMemory;
let authPlayerProvider: FakeAuthPlayerProvider;
let sut: ListPlayerNotificationsUseCase;

describe("List player notifications", () => {
  beforeEach(() => {
    notificationsRegistryRepository = new NotificationsRegistryRepositoryInMemory();
    playersRepository = new PlayersRepositoryInMemory();
    authPlayerProvider = new FakeAuthPlayerProvider();
    sut = new ListPlayerNotificationsUseCase(notificationsRegistryRepository, playersRepository, authPlayerProvider);
  });

  it("should be able to list paginated player notifications", async () => {
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

    const response = await sut.execute(auth.token, {
      page: 1,
      limit: 5
    });

    expect(response.total).toBe(5);
    expect(response.list.length).toBe(5);
  });
});
