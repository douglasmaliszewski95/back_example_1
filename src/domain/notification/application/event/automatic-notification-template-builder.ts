import { LogOrigin, LogLevel } from "../../../../core/enums/log-enum";
import { ApplicationLogRepository } from "../../../season/application/repositories/application-log-repository";
import { NotificationAutomaticTemplateRepository } from "../repositories/notification-automatic-template-repository";
import { AutomaticNotificationParams } from "./send-automatic-notification-event.types";

export class AutomaticNotificationTemplateBuilder {
  constructor(
    private readonly notificationAutomaticTemplateRepository: NotificationAutomaticTemplateRepository,
    private readonly applicationLogRepository: ApplicationLogRepository
  ) { }

  buildTemplate = async ({
    type,
    data
  }: AutomaticNotificationParams): Promise<{
    title: string;
    content: string;
  } | null> => {
    const template = await this.notificationAutomaticTemplateRepository.findBy({
      type,
      active: true
    });
    if (!template) {
      this.applicationLogRepository.create({
        content: `${type} template not found`,
        level: LogLevel.ERROR,
        origin: LogOrigin.BUILD_NOTIFICATION_TEMPLATE
      });
      return null;
    }

    const buildedTemplate = {
      title: template.title,
      content: template.content
    };
    const expectedVariables = Object.keys(data) as Array<keyof typeof data>;

    for (const variable of expectedVariables) {
      const regex = new RegExp(`{{${variable}}}`, "g");
      buildedTemplate.content = buildedTemplate.content.replace(regex, data[variable]);
      buildedTemplate.title = buildedTemplate.title.replace(regex, data[variable]);
    }

    const remainingVariablesRegex = /{{\w+}}/g;

    if (remainingVariablesRegex.test(buildedTemplate.content) || remainingVariablesRegex.test(buildedTemplate.title)) {
      this.applicationLogRepository.create({
        content: `Not all variables were replaced in the ${type} template`,
        level: LogLevel.ERROR,
        origin: LogOrigin.BUILD_NOTIFICATION_TEMPLATE
      });
      return null;
    }

    return buildedTemplate;
  };
}
