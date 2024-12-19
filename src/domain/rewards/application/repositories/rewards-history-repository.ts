import { RewardsHistoryData, RewardsHistoryDTO } from "./rewards-history-repository.types";

export interface RewardsHistoryRepository {
  create(data: RewardsHistoryData): Promise<RewardsHistoryDTO>;
  list(providerPlayerId: string): Promise<RewardsHistoryDTO[]>;
}
