import { StakingHistoryCreate, StakingHistoryDTO } from "./staking-history-repository.types";

export interface StakingHistoryRepository {
  create(data: StakingHistoryCreate): Promise<StakingHistoryDTO>;
  list(): Promise<{ sum: number; stakingId: number }[]>;
  listAll(): Promise<StakingHistoryDTO[]>;
  findByTxHash(txHash: string): Promise<StakingHistoryDTO | null>;
}
