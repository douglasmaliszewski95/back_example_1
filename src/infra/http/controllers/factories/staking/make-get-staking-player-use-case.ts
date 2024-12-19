import { GetStakingPlayerUseCase } from "../../../../../domain/staking/application/use-cases/get-staking-player-use-case";
import { PrismaStakingHistoryRepository } from "../../../../database/prisma-repositories/prisma-staking-history-repository";
import { PrismaStakingRepository } from "../../../../database/prisma-repositories/prisma-staking-repository";

export function makeGetStakingPlayerUseCase() {
  const stakingRepository = new PrismaStakingRepository();
  const stakingHistoryRepository = new PrismaStakingHistoryRepository();
  return new GetStakingPlayerUseCase(stakingRepository, stakingHistoryRepository);
}
