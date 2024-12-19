import { NotificationStatusEnum } from "./../../../../../core/enums/notification-status-enum";
import { beforeEach, describe, expect, it } from "vitest";
import { NotificationsRepositoryInMemory } from "../../../../../../tests/repository/notifications-repository-in-memory";
import { DeleteNotificationRegistryUseCase } from "../delete-notification-registry-use-case";
import { NotificationsRegistryRepositoryInMemory } from "../../../../../../tests/repository/notifications-registry-repository-in-memory";
import { makeNotification } from "../../../../../../tests/factories/make-notification";
import { makeNotificationRegistry } from "../../../../../../tests/factories/make-notification-registry";
import { HttpException } from "../../../../../core/errors/HttpException";

let notificationsRepository: NotificationsRepositoryInMemory;
let notificationRegistryRepository: NotificationsRegistryRepositoryInMemory;
let sut: DeleteNotificationRegistryUseCase;

describe("Delete notification registry", () => {
  beforeEach(() => {
    notificationsRepository = new NotificationsRepositoryInMemory();
    notificationRegistryRepository = new NotificationsRegistryRepositoryInMemory();
    sut = new DeleteNotificationRegistryUseCase(notificationsRepository, notificationRegistryRepository);
  });

  it("should be able to delete all notification registries by notificationId", async () => {
    const notification = makeNotification({
      id: 1,
      status: NotificationStatusEnum.DRAFT
    });
    for (let i = 0; i < 5; i++) {
      const notificationRegistry = makeNotificationRegistry({
        notificationId: notification.id,
        recipientId: i.toString()
      });
      await notificationsRepository.create(notification);
      await notificationRegistryRepository.create(notificationRegistry);
    }

    await sut.execute(notification.id!);

    expect(notificationRegistryRepository.notificationRegistry).toHaveLength(0);
  });

  it("should be able to delete one notification registry by notificationId and providerPlayerId", async () => {
    const notification = makeNotification({
      id: 1,
      status: NotificationStatusEnum.DRAFT
    });
    for (let i = 0; i < 5; i++) {
      const notificationRegistry = makeNotificationRegistry({
        notificationId: notification.id,
        recipientId: (i + 1).toString()
      });
      await notificationsRepository.create(notification);
      await notificationRegistryRepository.create(notificationRegistry);
    }

    await sut.execute(notification.id!, "1");

    expect(notificationRegistryRepository.notificationRegistry).toHaveLength(4);
  });

  it("should throw a exception if notification was not found", async () => {
    await expect(sut.execute(0)).rejects.toBeInstanceOf(HttpException);
  });

  it("should throw a exception if notification was already ACTIVE", async () => {
    const notification = makeNotification({
      id: 1,
      status: NotificationStatusEnum.ACTIVE
    });
    await notificationsRepository.create(notification);
    await expect(sut.execute(1)).rejects.toBeInstanceOf(HttpException);
  });
});
