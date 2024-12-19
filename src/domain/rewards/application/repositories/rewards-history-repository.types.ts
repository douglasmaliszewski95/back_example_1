interface RewardsHistoryData {
  providerPlayerId: string;
  rewardId: number;
  rewardPoints: number;
  availableDate: Date;
}

interface RewardsHistoryDTO {
  id: number;
  providerPlayerId: string;
  rewardId: number;
  points: number;
  createdAt: Date;
  availableAt: Date;
}

export { RewardsHistoryData, RewardsHistoryDTO };
