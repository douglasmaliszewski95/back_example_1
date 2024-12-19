import { NotificationRegistryOriginEnum } from "../../../../../../core/enums/notification-registry-origin-enum";
import { NotificationStatusEnum } from "../../../../../../core/enums/notification-status-enum";
import { NotificationTypeEnum } from "../../../../../../core/enums/notification-type-enum";
import { PlayersRepository } from "../../../../../user/application/repositories/players-repository";
import { NotificationRegistry } from "../../../../enterprise/entities/notification-registry";
import { NotificationsRegistryRepository } from "../../../repositories/notifications-registry-repository";
import { NotificationsRepository } from "../../../repositories/notifications-repository";
import { AbstractNotificationHandler } from "./abstract-notification-handler";
import { Notification } from "../../../../enterprise/entities/notification";
import { AutomaticNotificationTemplateBuilder } from "../../automatic-notification-template-builder";

export abstract class BaseNotificationHandler extends AbstractNotificationHandler {
  constructor(
    protected notificationsRepository: NotificationsRepository,
    protected playersRepository: PlayersRepository,
    protected notificationRegistryRepository: NotificationsRegistryRepository,
    protected automaticNotificationTemplateBuilder: AutomaticNotificationTemplateBuilder
  ) {
    super();
  }

  protected async createNotification(title: string, content: string) {
    const notification = Notification.create({
      content,
      status: NotificationStatusEnum.ACTIVE,
      tier: [1, 2, 3],
      title,
      type: NotificationTypeEnum.AUTOMATIC,
      startDate: new Date()
    });
    return await this.notificationsRepository.create(notification);
  }

  protected async createNotificationRegistry(notificationId: number, providerPlayerId: string) {
    const notificationRegistry = NotificationRegistry.create({
      notificationId,
      recipientId: providerPlayerId,
      origin: NotificationRegistryOriginEnum.AUTOMATIC
    });
    await this.notificationRegistryRepository.create(notificationRegistry);
  }

  protected async createManyNotificationRegistry(notificationId: number) {
    const recipients = await this.playersRepository.searchPlayersByActiveSeason({
      tier: [1, 2, 3]
    });
    await this.notificationRegistryRepository.createMany(
      notificationId,
      recipients.map(player =>
        NotificationRegistry.create({
          notificationId: notificationId,
          origin: NotificationRegistryOriginEnum.AUTOMATIC,
          recipientId: player.providerPlayerId
        })
      )
    );
  }
}
