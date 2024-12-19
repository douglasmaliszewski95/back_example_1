import { beforeEach, describe, expect, it } from 'vitest';
import { NotificationsRegistryRepositoryInMemory } from '../../../../../../tests/repository/notifications-registry-repository-in-memory';
import { ListRegistriesForNotificationUseCase } from '../list-registries-for-notification-use-case';
import { NotificationsRepositoryInMemory } from '../../../../../../tests/repository/notifications-repository-in-memory';
import { randomInt, randomUUID } from 'crypto';
import { makeNotification } from '../../../../../../tests/factories/make-notification';
import { NotificationStatusEnum } from '../../../../../core/enums/notification-status-enum';
import { makeNotificationRegistry } from '../../../../../../tests/factories/make-notification-registry';
import { NotificationRegistryOriginEnum } from '../../../../../core/enums/notification-registry-origin-enum';

let notificationsRepository: NotificationsRepositoryInMemory;
let notificationsRegistryRepository: NotificationsRegistryRepositoryInMemory;
let sut: ListRegistriesForNotificationUseCase;

describe("Create notification", () => {
  beforeEach(() => {
    notificationsRepository = new NotificationsRepositoryInMemory();
    notificationsRegistryRepository = new NotificationsRegistryRepositoryInMemory();
    sut = new ListRegistriesForNotificationUseCase(notificationsRepository, notificationsRegistryRepository);
  });

  it('should be able to list paginated registries', async () => {
    const notification = await notificationsRepository.create(makeNotification({
      status: NotificationStatusEnum.ACTIVE
    }));
    for (let i = 0; i < 20; i++) {
      const origin = Object.values(NotificationRegistryOriginEnum)[randomInt(3)];
      await notificationsRegistryRepository.create(
        makeNotificationRegistry({
          notificationId: notification.id,
          origin: origin,
          recipientId: randomUUID()
        })
      );
    }

    const response = await sut.execute(notification.id ?? 0, {
      limit: 10,
      page: 1
    });

    expect(response.result.list.length).toEqual(10);
  });
});