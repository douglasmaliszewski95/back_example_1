import { RewardType } from "../../../../core/enums/rewards-status-enum";

interface RewardsHistory {
  id: number;
  providerPlayerId: string;
  rewardId: number;
  points: number;
  createdAt: Date;
  availableAt: Date;
}

interface RewardsDTO {
  id: number;
  name: string;
  description: string;
  type: RewardType;
  active: boolean;
  points: number;
  createdAt: Date;
  updatedAt: Date;
  RewardsHistory: RewardsHistory[];
}

export { RewardsDTO };
