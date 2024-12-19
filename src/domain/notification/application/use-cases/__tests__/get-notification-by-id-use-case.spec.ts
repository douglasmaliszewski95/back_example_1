import { beforeEach, describe, expect, it } from "vitest";
import { NotificationsRepositoryInMemory } from "../../../../../../tests/repository/notifications-repository-in-memory";
import { GetNotificationByIdUseCase } from "../get-notification-by-id-use-case";
import { makeNotification } from "../../../../../../tests/factories/make-notification";
import { NotificationStatusEnum } from "../../../../../core/enums/notification-status-enum";

let notificationsRepository: NotificationsRepositoryInMemory;
let sut: GetNotificationByIdUseCase;

describe("Create notification", () => {
  beforeEach(() => {
    notificationsRepository = new NotificationsRepositoryInMemory();
    sut = new GetNotificationByIdUseCase(notificationsRepository);
  });

  it("should be able to get notification by id", async () => {
    const notification = await notificationsRepository.create(
      makeNotification({
        title: "test-title",
        content: "test content",
        status: NotificationStatusEnum.ACTIVE,
        tier: [1, 2, 3]
      })
    );
    const response = await sut.execute(notification.id ?? 0);
    expect(response.status).toEqual(NotificationStatusEnum.ACTIVE);
    expect(response.title).toEqual("test-title");
    expect(response.content).toEqual("test content");
  });
});
