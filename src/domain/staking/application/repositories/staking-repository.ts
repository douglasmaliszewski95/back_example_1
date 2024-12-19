import { StakingCreate, StakingDTO, StakingUpdate } from "./staking-repository.types";

export interface StakingRepository {
  findStakingForPlayer(wallet: string): Promise<StakingDTO | null>;
  create(data: StakingCreate): Promise<StakingDTO | null>;
  update(data: StakingUpdate): Promise<StakingDTO | null>;
}
