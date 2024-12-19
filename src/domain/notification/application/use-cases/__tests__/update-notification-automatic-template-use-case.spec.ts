import { beforeEach, describe, expect, it } from "vitest";
import { NotificationAutomaticTemplateRepositoryInMemory } from "../../../../../../tests/repository/notification-automatic-template-repository-in-memory";
import { makeNotificationAutomaticTemplate } from "../../../../../../tests/factories/make-notification-automatic-template";
import { AutomaticNotificationTypeEnum } from "../../../../../core/enums/notification-automatic-enum";
import { HttpException } from "../../../../../core/errors/HttpException";
import { UpdateNotificationAutomaticTemplateUseCase } from "../update-notification-automatic-template-use-case";
import { FakeAuthAdminProvider } from "../../../../../../tests/auth-provider/fake-auth-admin-provider";
import { makeAdmin } from "../../../../../../tests/factories/make-admin";
import { AdminStatus } from "../../../../../core/enums/admin-status-enum";

let notificationAutomaticTemplateRepository: NotificationAutomaticTemplateRepositoryInMemory;
let authAdminProvider: FakeAuthAdminProvider;
let sut: UpdateNotificationAutomaticTemplateUseCase;

describe("Update notification automatic template", () => {
  beforeEach(() => {
    notificationAutomaticTemplateRepository = new NotificationAutomaticTemplateRepositoryInMemory();
    authAdminProvider = new FakeAuthAdminProvider();
    sut = new UpdateNotificationAutomaticTemplateUseCase(notificationAutomaticTemplateRepository, authAdminProvider);
  });

  it("should be able to update a notification automatic template", async () => {
    const admin = makeAdmin({
      id: "token",
      status: AdminStatus.ACTIVE
    });
    await authAdminProvider.signup(admin);
    const notificationTemplate = await notificationAutomaticTemplateRepository.create(
      makeNotificationAutomaticTemplate({
        id: 1,
        title: "test-title",
        content: "test content",
        type: AutomaticNotificationTypeEnum.NEW_CAMPAIGN
      })
    );

    const response = await sut.execute(admin.id!, notificationTemplate.id, {
      title: "new-title",
      content: "new content"
    });

    expect(response.type).toEqual(AutomaticNotificationTypeEnum.NEW_CAMPAIGN);
    expect(response.title).toEqual("new-title");
    expect(response.content).toEqual("new content");
    expect(response.updatedBy).toEqual(admin.fullname);
  });

  it("should throw an exception if notification automatic template does not exist", async () => {
    const admin = makeAdmin({
      id: "token",
      status: AdminStatus.ACTIVE
    });
    await authAdminProvider.signup(admin);
    await expect(
      sut.execute(admin.id!, 0, {
        title: "new-title",
        content: "new content"
      })
    ).rejects.toBeInstanceOf(HttpException);
  });
});
