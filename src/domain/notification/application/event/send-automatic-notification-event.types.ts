import { AutomaticNotificationTypeEnum } from "../../../../core/enums/notification-automatic-enum";

enum RewardType {
  POINTS = "POINTS"
}

enum ChangeType {
  ADD = "ADD",
  REMOVE = "REMOVE"
}

type AutomaticNotificationParams =
  | {
      type: AutomaticNotificationTypeEnum.NEW_CAMPAIGN;
      data: {
        campaignName: string;
      };
    }
  | {
      type: AutomaticNotificationTypeEnum.CAMPAIGN_DEADLINE;
      data: {
        campaignName: string;
        endDate: Date;
      };
    }
  | {
      type: AutomaticNotificationTypeEnum.START_SEASON;
      data: {
        seasonName: string;
        startDate: Date;
      };
    }
  | {
      type: AutomaticNotificationTypeEnum.END_SEASON;
      data: {
        seasonName: string;
        endDate: Date;
      };
    }
  | {
      type: AutomaticNotificationTypeEnum.REWARD;
      data: {
        rewardType: RewardType;
        rewardQuantity: string;
        providerPlayerId: string;
      };
    }
  | {
      type: AutomaticNotificationTypeEnum.TIER;
      data: {
        changeType: ChangeType;
        tier: number;
        providerPlayerId: string;
      };
    };

export { AutomaticNotificationParams, RewardType, ChangeType };
