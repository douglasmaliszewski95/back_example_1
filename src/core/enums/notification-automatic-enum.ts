export enum AutomaticNotificationTypeEnum {
  NEW_CAMPAIGN = "NEW_CAMPAIGN",
  CAMPAIGN_DEADLINE = "CAMPAIGN_DEADLINE",
  START_SEASON = "START_SEASON",
  END_SEASON = "END_SEASON",
  REWARD = "REWARD",
  TIER = "TIER"
}

export type AutomaticNotificationType = `${AutomaticNotificationTypeEnum}`;
