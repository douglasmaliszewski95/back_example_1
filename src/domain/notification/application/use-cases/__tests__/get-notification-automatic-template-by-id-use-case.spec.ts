import { beforeEach, describe, expect, it } from "vitest";
import { GetNotificationAutomaticTemplateByIdUseCase } from "../get-notification-automatic-template-by-id-use-case";
import { NotificationAutomaticTemplateRepositoryInMemory } from "../../../../../../tests/repository/notification-automatic-template-repository-in-memory";
import { makeNotificationAutomaticTemplate } from "../../../../../../tests/factories/make-notification-automatic-template";
import { AutomaticNotificationTypeEnum } from "../../../../../core/enums/notification-automatic-enum";
import { HttpException } from "../../../../../core/errors/HttpException";

let notificationAutomaticTemplateRepository: NotificationAutomaticTemplateRepositoryInMemory;
let sut: GetNotificationAutomaticTemplateByIdUseCase;

describe("Get notification automatic template by id", () => {
  beforeEach(() => {
    notificationAutomaticTemplateRepository = new NotificationAutomaticTemplateRepositoryInMemory();
    sut = new GetNotificationAutomaticTemplateByIdUseCase(notificationAutomaticTemplateRepository);
  });

  it("should be able to get notification automatic template by id", async () => {
    const notificationTemplate = await notificationAutomaticTemplateRepository.create(
      makeNotificationAutomaticTemplate({
        id: 1,
        title: "test-title",
        content: "test content",
        type: AutomaticNotificationTypeEnum.NEW_CAMPAIGN
      })
    );
    const response = await sut.execute(notificationTemplate.id);
    expect(response.type).toEqual(AutomaticNotificationTypeEnum.NEW_CAMPAIGN);
    expect(response.title).toEqual("test-title");
    expect(response.content).toEqual("test content");
  });

  it("should throw an exception if notification automatic template does not exist", async () => {
    await expect(sut.execute(0)).rejects.toBeInstanceOf(HttpException);
  });
});
