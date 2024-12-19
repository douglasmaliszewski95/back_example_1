import { beforeEach, describe, expect, it } from "vitest";
import { NotificationAutomaticTemplateRepositoryInMemory } from "../../../../../../tests/repository/notification-automatic-template-repository-in-memory";
import { makeNotificationAutomaticTemplate } from "../../../../../../tests/factories/make-notification-automatic-template";
import { ListNotificationAutomaticTemplatesUseCase } from "../list-notification-automatic-templates-use-case";

let notificationAutomaticTemplateRepository: NotificationAutomaticTemplateRepositoryInMemory;
let sut: ListNotificationAutomaticTemplatesUseCase;

describe("List notification automatic templates", () => {
  beforeEach(() => {
    notificationAutomaticTemplateRepository = new NotificationAutomaticTemplateRepositoryInMemory();
    sut = new ListNotificationAutomaticTemplatesUseCase(notificationAutomaticTemplateRepository);
  });

  it("should be able to list paginated notification automatic templates", async () => {
    for (let i = 1; i <= 20; i++) {
      await notificationAutomaticTemplateRepository.create(
        makeNotificationAutomaticTemplate({
          id: i,
          title: "test-title",
          content: "test content"
        })
      );
    }

    const response = await sut.execute({
      page: 1,
      limit: 10
    });

    expect(response.total).toEqual(20);
    expect(response.page).toEqual(1);
    expect(response.limit).toEqual(10);
    expect(response.list.length).toEqual(10);
  });
});
