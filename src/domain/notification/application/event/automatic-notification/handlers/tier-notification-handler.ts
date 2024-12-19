import { AutomaticNotificationTypeEnum } from "../../../../../../core/enums/notification-automatic-enum";
import { AutomaticNotificationParams } from "../../send-automatic-notification-event.types";
import { BaseNotificationHandler } from "./base-notification-handler";

export class TierNotificationHandler extends BaseNotificationHandler {
  async sendNotification(params: AutomaticNotificationParams): Promise<void> {
    if (params.type === AutomaticNotificationTypeEnum.TIER) {
      const template = await this.automaticNotificationTemplateBuilder.buildTemplate(params);
      if (!template) return;
      const { content, title } = template;
      const notification = await this.createNotification(title, content);
      if (!notification || !notification.id) return;
      await this.createNotificationRegistry(notification.id, params.data.providerPlayerId);
    } else {
      await super.sendNotification(params);
    }
  }
}
