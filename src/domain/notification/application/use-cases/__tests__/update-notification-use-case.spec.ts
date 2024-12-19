import { beforeEach, describe, expect, it } from "vitest";
import { NotificationsRepositoryInMemory } from "../../../../../../tests/repository/notifications-repository-in-memory";
import { UpdateNotificationUseCase } from "../update-notification-use-case";
import { makeNotification } from "../../../../../../tests/factories/make-notification";
import { NotificationStatusEnum } from "../../../../../core/enums/notification-status-enum";
import { HttpException } from "../../../../../core/errors/HttpException";

let notificationsRepository: NotificationsRepositoryInMemory;
let sut: UpdateNotificationUseCase;

describe("Create notification registry", () => {
  beforeEach(() => {
    notificationsRepository = new NotificationsRepositoryInMemory();
    sut = new UpdateNotificationUseCase(notificationsRepository);
  });

  it("should be able to update a notification", async () => {
    const notification = await notificationsRepository.create(
      makeNotification({
        status: NotificationStatusEnum.DRAFT
      })
    );

    const response = await sut.execute(notification.id ?? 0, {
      isDraft: false
    });
    expect(response.status).toEqual(NotificationStatusEnum.ACTIVE);
  });

  it("should not be able to update a not existent notification", async () => {
    await expect(sut.execute(0, {
      isDraft: false
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to update a already activated notification", async () => {
    const notification = await notificationsRepository.create(
      makeNotification({
        status: NotificationStatusEnum.ACTIVE
      })
    );

    await expect(sut.execute(notification.id ?? 0, {
      isDraft: false
    })).rejects.toBeInstanceOf(HttpException);
  });
});
