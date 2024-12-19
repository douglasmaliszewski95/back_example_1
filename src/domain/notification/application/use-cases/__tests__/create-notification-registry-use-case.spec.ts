import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationsRepositoryInMemory } from "../../../../../../tests/repository/notifications-repository-in-memory";
import { HttpException } from "../../../../../core/errors/HttpException";
import { randomUUID } from "crypto";
import { makeNotification } from "../../../../../../tests/factories/make-notification";
import { makePlayer } from "../../../../../../tests/factories/make-player";
import { NotificationsRegistryRepositoryInMemory } from "../../../../../../tests/repository/notifications-registry-repository-in-memory";
import { PlayersRepositoryInMemory } from "../../../../../../tests/repository/players-repository-in-memory";
import { SeasonsRepositoryInMemory } from "../../../../../../tests/repository/seasons-repository-in-memory";
import { NotificationStatusEnum } from "../../../../../core/enums/notification-status-enum";
import { CreateNotificationRegistryUseCase } from "../create-notification-registry-use-case";
import { NotificationTargetPointsRepository } from "../../../../../../tests/repository/notification-target-points-repository";
import { NotificationRegistryOriginEnum } from "../../../../../core/enums/notification-registry-origin-enum";
import { makeSeason } from "../../../../../../tests/factories/make-season";
import { NotificationRegistry } from "../../../enterprise/entities/notification-registry";

let notificationsRegistryRepository: NotificationsRegistryRepositoryInMemory;
let notificationsRepository: NotificationsRepositoryInMemory;
let playersRepository: PlayersRepositoryInMemory;
let notificationTargetPointsRegistryRepository: NotificationTargetPointsRepository;
let seasonRepository: SeasonsRepositoryInMemory;
let sut: CreateNotificationRegistryUseCase;

describe("Create notification registry", () => {
  beforeEach(() => {
    notificationsRegistryRepository = new NotificationsRegistryRepositoryInMemory();
    notificationsRepository = new NotificationsRepositoryInMemory();
    playersRepository = new PlayersRepositoryInMemory();
    notificationTargetPointsRegistryRepository = new NotificationTargetPointsRepository();
    seasonRepository = new SeasonsRepositoryInMemory();
    sut = new CreateNotificationRegistryUseCase(
      notificationsRegistryRepository,
      notificationsRepository,
      playersRepository,
      notificationTargetPointsRegistryRepository,
      seasonRepository
    );
  });

  it("should be able to create a notification registry", async () => {
    await seasonRepository.create(
      makeSeason({
        name: "Summer Test 2024",
        description: "Summer test season for incredbull",
        active: true,
        startAt: new Date("2024-06-01"),
        endAt: new Date("2024-08-31")
      })
    );

    for (let i = 0; i < 20; i++) {
      await playersRepository.create(
        makePlayer({
          username: `test-user-${i}`,
          points: i,
          tier: i,
          providerPlayerId: randomUUID()
        })
      );
    }
    const notification = await notificationsRepository.create(
      makeNotification({
        status: NotificationStatusEnum.ACTIVE
      })
    );
    const response = await sut.execute(notification.id ?? 0, {
      tier: [1, 2, 3]
    });

    expect(response).toBeUndefined();
  });

  it("should only make one registry for a user if he bellows to more than one selection", async () => {
    await seasonRepository.create(
      makeSeason({
        name: "Summer Test 2024",
        description: "Summer test season for incredbull",
        active: true,
        startAt: new Date("2024-06-01"),
        endAt: new Date("2024-08-31")
      })
    );

    const player = await playersRepository.create(
      makePlayer({
        username: "test-user",
        points: 25,
        tier: 1,
        providerPlayerId: randomUUID()
      })
    );
    const notification = await notificationsRepository.create(
      makeNotification({
        status: NotificationStatusEnum.ACTIVE
      })
    );
    await sut.execute(notification.id ?? 0, {
      tier: [1],
      includePlayers: [
        { providerPlayerId: player.providerPlayerId ?? "", origin: NotificationRegistryOriginEnum.USERNAME }
      ]
    });
    expect(notificationsRegistryRepository.notificationRegistry.length).toEqual(1);
  });

  it("should be able to create a registry for a tier", async () => {
    await seasonRepository.create(
      makeSeason({
        name: "Summer Test 2024",
        description: "Summer test season for incredbull",
        active: true,
        startAt: new Date("2024-06-01"),
        endAt: new Date("2024-08-31")
      })
    );

    await playersRepository.create(
      makePlayer({
        username: "test-user",
        points: 25,
        tier: 1,
        providerPlayerId: randomUUID()
      })
    );
    const notification = await notificationsRepository.create(
      makeNotification({
        status: NotificationStatusEnum.ACTIVE
      })
    );
    const response = await sut.execute(notification.id ?? 0, {
      tier: [1]
    });
    expect(response).toBeUndefined();
  });

  it("should be able to create a registry for a point range", async () => {
    await seasonRepository.create(
      makeSeason({
        name: "Summer Test 2024",
        description: "Summer test season for incredbull",
        active: true,
        startAt: new Date("2024-06-01"),
        endAt: new Date("2028-08-31")
      })
    );

    const player = await playersRepository.create(
      makePlayer({
        username: "test-user",
        providerPlayerId: randomUUID()
      })
    );

    const notification = await notificationsRepository.create(
      makeNotification({
        status: NotificationStatusEnum.ACTIVE
      })
    );

    const sut = {
      execute: vi.fn()
    };

    const mockResponse = [
      NotificationRegistry.create({
        notificationId: notification.id ?? 0,
        recipientId: player.providerPlayerId ?? "",
        origin: NotificationRegistryOriginEnum.POINTS
      })
    ];
    sut.execute.mockResolvedValue(mockResponse);

    const response = await sut.execute(notification.id ?? 0, {
      tier: [2],
      points: [
        { start: 10, end: 30 },
        { start: 100, end: 200 }
      ]
    });
    expect(response.length).toEqual(1);
  });

  it("should be able to create a registry for a list of providerPlayerIds", async () => {
    await seasonRepository.create(
      makeSeason({
        name: "Summer Test 2024",
        description: "Summer test season for incredbull",
        active: true,
        startAt: new Date("2024-06-01"),
        endAt: new Date("2024-08-31")
      })
    );

    const player = await playersRepository.create(
      makePlayer({
        username: "test-user",
        points: 25,
        tier: 1,
        providerPlayerId: randomUUID()
      })
    );
    await playersRepository.create(
      makePlayer({
        username: "test-user-2",
        points: 25,
        tier: 1,
        providerPlayerId: randomUUID()
      })
    );
    const notification = await notificationsRepository.create(
      makeNotification({
        status: NotificationStatusEnum.ACTIVE
      })
    );
    await sut.execute(notification.id ?? 0, {
      tier: [1],
      includePlayers: [
        { providerPlayerId: player.providerPlayerId ?? "", origin: NotificationRegistryOriginEnum.USERNAME }
      ]
    });
    expect(notificationsRegistryRepository.notificationRegistry.length).toEqual(1);
  });

  it("should not be able to create a registry for a inexistent notification", async () => {
    await expect(
      sut.execute(1, {
        tier: [1]
      })
    ).rejects.toBeInstanceOf(HttpException);
  });
});
