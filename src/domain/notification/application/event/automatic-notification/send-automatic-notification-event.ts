import { PlayersRepository } from "../../../../user/application/repositories/players-repository";
import { NotificationsRegistryRepository } from "../../repositories/notifications-registry-repository";
import { NotificationsRepository } from "../../repositories/notifications-repository";
import { AutomaticNotificationTemplateBuilder } from "../automatic-notification-template-builder";
import { AutomaticNotificationParams } from "../send-automatic-notification-event.types";
import { Handler } from "./handler";
import { CampaignDeadlineNotificationHandler } from "./handlers/campaign-deadline-notification-handler";
import { EndSeasonNotificationHandler } from "./handlers/end-season-notification-handler";
import { NewCampaignNotificationHandler } from "./handlers/new-campaign-notification-handler";
import { RewardNotificationHandler } from "./handlers/reward-notification-handler";
import { StartSeasonNotificationHandler } from "./handlers/start-season-notification-handler";
import { TierNotificationHandler } from "./handlers/tier-notification-handler";

export class SendAutomaticNotificationEvent {
  private chain: Handler;

  constructor(
    private notificationsRepository: NotificationsRepository,
    private notificationRegistryRepository: NotificationsRegistryRepository,
    private playersRepository: PlayersRepository,
    private automaticNotificationTemplateBuilder: AutomaticNotificationTemplateBuilder
  ) {
    const newCampaignHandler = new NewCampaignNotificationHandler(
      notificationsRepository,
      playersRepository,
      notificationRegistryRepository,
      automaticNotificationTemplateBuilder
    );
    const campaignDeadlineHandler = new CampaignDeadlineNotificationHandler(
      notificationsRepository,
      playersRepository,
      notificationRegistryRepository,
      automaticNotificationTemplateBuilder
    );
    const startSeasonHandler = new StartSeasonNotificationHandler(
      notificationsRepository,
      playersRepository,
      notificationRegistryRepository,
      automaticNotificationTemplateBuilder
    );
    const endSeasonHandler = new EndSeasonNotificationHandler(
      notificationsRepository,
      playersRepository,
      notificationRegistryRepository,
      automaticNotificationTemplateBuilder
    );
    const rewardHandler = new RewardNotificationHandler(
      notificationsRepository,
      playersRepository,
      notificationRegistryRepository,
      automaticNotificationTemplateBuilder
    );
    const tierHandler = new TierNotificationHandler(
      notificationsRepository,
      playersRepository,
      notificationRegistryRepository,
      automaticNotificationTemplateBuilder
    );

    newCampaignHandler.setHandler(campaignDeadlineHandler);
    newCampaignHandler.setHandler(campaignDeadlineHandler);
    campaignDeadlineHandler.setHandler(startSeasonHandler);
    startSeasonHandler.setHandler(endSeasonHandler);
    endSeasonHandler.setHandler(rewardHandler);
    rewardHandler.setHandler(tierHandler);

    this.chain = newCampaignHandler;
  }

  async send(params: AutomaticNotificationParams): Promise<void> {
    await this.chain.sendNotification(params);
  }
}
