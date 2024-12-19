import { SaveDepositValueWalletUseCase } from "../../../../../domain/staking/application/use-cases/save-deposit-value-wallet-use-case";
import { PrismaStakingHistoryRepository } from "../../../../database/prisma-repositories/prisma-staking-history-repository";
import { PrismaStakingRepository } from "../../../../database/prisma-repositories/prisma-staking-repository";

export function makeSaveDepositValueWalletUseCase() {
  const stakingRepository = new PrismaStakingRepository();
  const stakingHistoryRepository = new PrismaStakingHistoryRepository();
  return new SaveDepositValueWalletUseCase(stakingRepository, stakingHistoryRepository);
}
