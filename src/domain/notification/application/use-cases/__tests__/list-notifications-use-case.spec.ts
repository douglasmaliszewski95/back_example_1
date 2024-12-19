import { beforeEach, describe, expect, it } from "vitest";
import { NotificationsRepositoryInMemory } from "../../../../../../tests/repository/notifications-repository-in-memory";
import { ListNotificationsUseCase } from "../list-notifications-use-case";
import { makeNotification } from "../../../../../../tests/factories/make-notification";

let notificationsRepository: NotificationsRepositoryInMemory;
let sut: ListNotificationsUseCase;

describe("Create notification", () => {
  beforeEach(() => {
    notificationsRepository = new NotificationsRepositoryInMemory();
    sut = new ListNotificationsUseCase(notificationsRepository);
  });

  it("should be able to list paginated notifications", async () => {
    for (let i = 0; i < 30; i++) {
      const notification = makeNotification({
        title: `notification-${i}`
      });
      await notificationsRepository.create(notification);
    }

    const response = await sut.execute({
      page: 2,
      limit: 10
    });

    expect(response.total).toEqual(30);
    expect(response.list).toEqual([
      expect.objectContaining({ title: "notification-10" }),
      expect.objectContaining({ title: "notification-11" }),
      expect.objectContaining({ title: "notification-12" }),
      expect.objectContaining({ title: "notification-13" }),
      expect.objectContaining({ title: "notification-14" }),
      expect.objectContaining({ title: "notification-15" }),
      expect.objectContaining({ title: "notification-16" }),
      expect.objectContaining({ title: "notification-17" }),
      expect.objectContaining({ title: "notification-18" }),
      expect.objectContaining({ title: "notification-19" })
    ]);
  });

  it("should be able to filter the list of notifications by title", async () => {
    for (let i = 0; i < 30; i++) {
      const notification = makeNotification({
        title: `notification-${i}`
      });
      await notificationsRepository.create(notification);
    }

    const response = await sut.execute({
      page: 1,
      limit: 10,
      title: "notification-20"
    });

    expect(response.list).toHaveLength(1);
  });

  it("should be able to filter the list of notifications by tier", async () => {
    for (let i = 0; i < 30; i++) {
      const notification = makeNotification({
        tier: [i]
      });
      await notificationsRepository.create(notification);
    }

    const response = await sut.execute({
      page: 1,
      limit: 10,
      tier: "20"
    });

    expect(response.list).toHaveLength(1);
  });

  it("should be able to filter the list of notifications by start date", async () => {
    for (let i = 0; i < 30; i++) {
      const notification = makeNotification({
        startDate: new Date(new Date().getTime() + i * 60 * 60 * 1000)
      });
      await notificationsRepository.create(notification);
    }

    const response = await sut.execute({
      page: 1,
      limit: 10,
      startDate: new Date(new Date().getTime() + 25 * 59 * 60 * 1000)
    });

    expect(response.list).toHaveLength(5);
  });
});
