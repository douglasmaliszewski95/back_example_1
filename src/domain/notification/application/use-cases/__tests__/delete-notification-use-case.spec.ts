import { beforeEach, describe, expect, it } from "vitest";
import { NotificationsRepositoryInMemory } from "../../../../../../tests/repository/notifications-repository-in-memory";
import { makeNotification } from "../../../../../../tests/factories/make-notification";
import { HttpException } from "../../../../../core/errors/HttpException";
import { DeleteNotificationUseCase } from "../delete-notification-use-case";

let notificationsRepository: NotificationsRepositoryInMemory;
let sut: DeleteNotificationUseCase;

describe("Delete notification", () => {
  beforeEach(() => {
    notificationsRepository = new NotificationsRepositoryInMemory();
    sut = new DeleteNotificationUseCase(notificationsRepository);
  });

  it("should be able to delete a notification by notificationId", async () => {
    const notification = makeNotification({ id: 1 });
    await notificationsRepository.create(notification);

    await sut.execute(notification.id!);

    expect(notificationsRepository.notifications).toHaveLength(0);
  });

  it("should throw a exception if notification was not found", async () => {
    await expect(sut.execute(0)).rejects.toBeInstanceOf(HttpException);
  });
});
