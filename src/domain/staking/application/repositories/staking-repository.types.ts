interface StakingHistory {
  id: number;
  stakingId: number;
  tokenDeposit: number;
  createdAt: Date;
  updatedAt: Date;
}

interface StakingDTO {
  id: number;
  totalDeposit: number;
  currency: string;
  progress: number;
  wallet: string;
  StakingHistory?: StakingHistory[];
  createdAt: Date;
  updatedAt: Date;
}

interface StakingCreate {
  totalDeposit: number;
  currency: string;
  progress: number;
  wallet: string;
}

interface StakingUpdate {
  id: number;
  valueSum: number;
  progress: number;
}

export { StakingDTO, StakingCreate, StakingUpdate };
