import { beforeEach, describe, expect, it } from 'vitest';
import { NotificationsRepositoryInMemory } from '../../../../../../tests/repository/notifications-repository-in-memory';
import { CreateNotificationUseCase } from '../create-notification-use-case';
import { HttpException } from '../../../../../core/errors/HttpException';

let notificationsRepository: NotificationsRepositoryInMemory;
let sut: CreateNotificationUseCase;

describe("Create notification", () => {
  beforeEach(() => {
    notificationsRepository = new NotificationsRepositoryInMemory();
    sut = new CreateNotificationUseCase(notificationsRepository);
  });

  it("should be able to create a notification", async () => {
    const response = await sut.execute({
      content: 'test-content',
      title: 'test-title'
    });

    expect(response.notification.content).toEqual("test-content");
  });

  it("should not be able to create a notification with invalid start date", async () => {
    await expect(sut.execute({
      content: 'test-content',
      title: 'test-title',
      startDate: new Date(new Date().getTime() - (60 * 1000))
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to create a notification with invalid end date", async () => {
    await expect(sut.execute({
      content: 'test-content',
      title: 'test-title',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() - (60 * 1000))
    })).rejects.toBeInstanceOf(HttpException);
  });
});