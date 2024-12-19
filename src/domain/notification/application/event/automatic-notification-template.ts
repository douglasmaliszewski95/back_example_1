import { AutomaticNotificationTypeEnum } from "../../../../core/enums/notification-automatic-enum";
import { RewardType, ChangeType } from "./send-automatic-notification-event.types";

const TemplateBuilder = {
  [AutomaticNotificationTypeEnum.NEW_CAMPAIGN]: (campaignName: string) => ({
    title: `New Campaign: ${campaignName}`,
    content: `A new campaign has been created: ${campaignName}`
  }),
  [AutomaticNotificationTypeEnum.CAMPAIGN_DEADLINE]: (campaignName: string, endDate: Date) => ({
    title: `Campaign Deadline: ${campaignName}`,
    content: `${campaignName} is ending in ${endDate}`
  }),
  [AutomaticNotificationTypeEnum.END_SEASON]: (seasonName: string, endDate: Date) => ({
    title: `Season Ended: ${seasonName}`,
    content: `${seasonName} is ending in ${endDate}`
  }),
  [AutomaticNotificationTypeEnum.START_SEASON]: (seasonName: string, startDate: Date) => ({
    title: `Season Started: ${seasonName}`,
    content: `${seasonName} has started in ${startDate}`
  }),
  [AutomaticNotificationTypeEnum.REWARD]: (
    rewardType: RewardType,
    rewardQuantity: string,
    providerPlayerId: string
  ) => ({
    title: `Reward: ${rewardType}`,
    content: `You earned ${rewardQuantity} ${rewardType}`
  }),
  [AutomaticNotificationTypeEnum.TIER]: (changeType: ChangeType, tier: number, providerPlayerId: string) => ({
    title: `Tier ${changeType}: ${tier}`,
    content: `You have been promoted to tier ${tier}`
  })
};

export { TemplateBuilder };
