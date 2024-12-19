import { AutomaticNotificationTemplateBuilder } from "../../src/domain/notification/application/event/automatic-notification-template-builder";
import { AutomaticNotificationParams } from "../../src/domain/notification/application/event/send-automatic-notification-event.types";
import { ApplicationLogRepositoryInMemory } from "../repository/application-log-repository-in-memory";
import { NotificationAutomaticTemplateRepositoryInMemory } from "../repository/notification-automatic-template-repository-in-memory";

export class FakeAutomaticNotificationTemplateBuilder extends AutomaticNotificationTemplateBuilder {
  constructor(
    notificationAutomaticTemplateRepository: NotificationAutomaticTemplateRepositoryInMemory,
    applicationLogRepository: ApplicationLogRepositoryInMemory
  ) {
    super(notificationAutomaticTemplateRepository, applicationLogRepository);
  }

  buildTemplate = async ({
    type,
    data
  }: AutomaticNotificationParams): Promise<{
    title: string;
    content: string;
  } | null> => {
    console.log("Fake buildTemplate method called");
    return {
      title: `Fake Title for ${type}`,
      content: `Fake Content for ${type}`
    };
  };
}
