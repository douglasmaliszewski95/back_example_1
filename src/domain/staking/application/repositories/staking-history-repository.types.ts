interface StakingHistoryCreate {
  txHash: string;
  stakingId: number;
  tokenDeposit: number;
}

interface StakingHistoryDTO {
  id: number;
  txHash: string;
  stakingId: number;
  tokenDeposit: number;
  createdAt: Date;
  updatedAt: Date;
}

export { StakingHistoryCreate, StakingHistoryDTO };
