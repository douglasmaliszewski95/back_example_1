import { ClaimRewardPlayerUseCase } from "../../../../../domain/rewards/application/use-cases/claim-reward-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayerSeasonPointsRepository } from "../../../../database/prisma-repositories/prisma-player-season-points-repository";
import { PrismaPlayerTotalPointsRepository } from "../../../../database/prisma-repositories/prisma-player-total-points-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PrismaRewardsHistoryRepository } from "../../../../database/prisma-repositories/prisma-rewards-history-repository";
import { PrismaRewardsRepository } from "../../../../database/prisma-repositories/prisma-rewards-repository";
import { PrismaSeasonsRepository } from "../../../../database/prisma-repositories/prisma-seasons-repository";

export function makeClaimRewardPlayerUseCase() {
  const gateway = new SupabaseAuthPlayerProvider();
  const playersRepository = new PrismaPlayersRepository();
  const playerSeasonPointsRepository = new PrismaPlayerSeasonPointsRepository();
  const playerTotalPointsRepository = new PrismaPlayerTotalPointsRepository();
  const rewardsRepository = new PrismaRewardsRepository();
  const rewardsHistoryRepository = new PrismaRewardsHistoryRepository();
  const seasonsRepository = new PrismaSeasonsRepository();
  const sut = new ClaimRewardPlayerUseCase(
    gateway,
    playersRepository,
    playerSeasonPointsRepository,
    playerTotalPointsRepository,
    rewardsRepository,
    rewardsHistoryRepository,
    seasonsRepository
  );
  return sut;
}
