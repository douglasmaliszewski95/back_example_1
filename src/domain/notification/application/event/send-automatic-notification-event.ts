import { NotificationsRegistryRepository } from "../repositories/notifications-registry-repository";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { ChangeType, RewardType, AutomaticNotificationParams } from "./send-automatic-notification-event.types";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRegistry } from "../../enterprise/entities/notification-registry";
import { NotificationTypeEnum } from "../../../../core/enums/notification-type-enum";
import { NotificationStatusEnum } from "../../../../core/enums/notification-status-enum";
import { TemplateBuilder } from "./automatic-notification-template";
import { NotificationRegistryOriginEnum } from "../../../../core/enums/notification-registry-origin-enum";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { AutomaticNotificationTypeEnum } from "../../../../core/enums/notification-automatic-enum";

export class SendAutomaticNotificationEvent {
  constructor(
    private notificationsRepository: NotificationsRepository,
    private notificationRegistryRepository: NotificationsRegistryRepository,
    private playersRepository: PlayersRepository
  ) {}

  send = async ({ type, data }: AutomaticNotificationParams) => {
    switch (type) {
      case AutomaticNotificationTypeEnum.NEW_CAMPAIGN:
        await this.sendNewCampaignNotification(data.campaignName);
        break;
      case AutomaticNotificationTypeEnum.CAMPAIGN_DEADLINE:
        await this.sendCampaignDeadLineNotification(data.campaignName, data.endDate);
        break;
      case AutomaticNotificationTypeEnum.START_SEASON:
        await this.sendStartSeasonNotification(data.seasonName, data.startDate);
        break;
      case AutomaticNotificationTypeEnum.END_SEASON:
        await this.sendEndSeasonNotification(data.seasonName, data.endDate);
        break;
      case AutomaticNotificationTypeEnum.REWARD:
        await this.sendRewardNotification(data.rewardType, data.rewardQuantity, data.providerPlayerId);
        break;
      case AutomaticNotificationTypeEnum.TIER:
        await this.sendTierNotification(data.changeType, data.tier, data.providerPlayerId);
        break;
    }
  };

  private sendNewCampaignNotification = async (campaignName: string) => {
    const { title, content } = TemplateBuilder[AutomaticNotificationTypeEnum.NEW_CAMPAIGN](campaignName);
    const notification = await this.createNotification(title, content);
    if (!notification || !notification.id) return;
    await this.creteManyNotificationRegistry(notification.id);
  };

  private sendCampaignDeadLineNotification = async (campaignName: string, endDate: Date) => {
    const { title, content } = TemplateBuilder[AutomaticNotificationTypeEnum.CAMPAIGN_DEADLINE](campaignName, endDate);
    const notification = await this.createNotification(title, content);
    if (!notification || !notification.id) return;
    await this.creteManyNotificationRegistry(notification.id);
  };

  private sendStartSeasonNotification = async (seasonName: string, startdate: Date) => {
    const { title, content } = TemplateBuilder[AutomaticNotificationTypeEnum.START_SEASON](seasonName, startdate);
    const notification = await this.createNotification(title, content);
    if (!notification || !notification.id) return;
    await this.creteManyNotificationRegistry(notification.id);
  };

  private sendEndSeasonNotification = async (seasonName: string, endDate: Date) => {
    const { title, content } = TemplateBuilder[AutomaticNotificationTypeEnum.END_SEASON](seasonName, endDate);
    const notification = await this.createNotification(title, content);
    if (!notification || !notification.id) return;
    await this.creteManyNotificationRegistry(notification.id);
  };

  private sendRewardNotification = async (rewardType: RewardType, rewardQuantity: string, providerPlayerId: string) => {
    const { title, content } = TemplateBuilder[AutomaticNotificationTypeEnum.REWARD](
      rewardType,
      rewardQuantity,
      providerPlayerId
    );
    const notification = await this.createNotification(title, content);
    if (!notification || !notification.id) return;
    await this.createNotificationRegistry(notification.id, providerPlayerId);
  };

  private sendTierNotification = async (changeType: ChangeType, tier: number, providerPlayerId: string) => {
    const { title, content } = TemplateBuilder[AutomaticNotificationTypeEnum.TIER](changeType, tier, providerPlayerId);
    const notification = await this.createNotification(title, content);
    if (!notification || !notification.id) return;
    await this.createNotificationRegistry(notification.id, providerPlayerId);
  };

  private createNotification = async (title: string, content: string) => {
    const notification = Notification.create({
      content,
      status: NotificationStatusEnum.ACTIVE,
      tier: [1, 2, 3],
      title,
      type: NotificationTypeEnum.AUTOMATIC,
      startDate: new Date()
    });
    return await this.notificationsRepository.create(notification);
  };

  private createNotificationRegistry = async (notificationId: number, providerPlayerId: string) => {
    const notificationRegistry = NotificationRegistry.create({
      notificationId,
      recipientId: providerPlayerId,
      origin: NotificationRegistryOriginEnum.AUTOMATIC
    });
    await this.notificationRegistryRepository.create(notificationRegistry);
  };

  private creteManyNotificationRegistry = async (notificationId: number) => {
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
  };
}
