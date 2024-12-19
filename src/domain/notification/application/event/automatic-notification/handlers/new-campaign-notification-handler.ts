import { AutomaticNotificationTypeEnum } from "../../../../../../core/enums/notification-automatic-enum";
import { AutomaticNotificationParams } from "../../send-automatic-notification-event.types";
import { BaseNotificationHandler } from "./base-notification-handler";

export class NewCampaignNotificationHandler extends BaseNotificationHandler {
  async sendNotification(params: AutomaticNotificationParams): Promise<void> {
    if (params.type === AutomaticNotificationTypeEnum.NEW_CAMPAIGN) {
      const template = await this.automaticNotificationTemplateBuilder.buildTemplate(params);
      if (!template) return;
      const { content, title } = template;
      const notification = await this.createNotification(title, content);
      if (!notification || !notification.id) return;
      await this.createManyNotificationRegistry(notification.id);
    } else {
      await super.sendNotification(params);
    }
  }
}
