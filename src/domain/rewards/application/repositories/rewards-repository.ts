import { RewardsDTO } from "./rewards-repository.types";

export interface RewardsRepository {
  findRewardByName(name: string): Promise<RewardsDTO | null>;
}
