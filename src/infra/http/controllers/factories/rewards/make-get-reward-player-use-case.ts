import { GetRewardPlayerUseCase } from "../../../../../domain/rewards/application/use-cases/get-reward-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PrismaRewardsRepository } from "../../../../database/prisma-repositories/prisma-rewards-repository";

export function makeGetRewardPlayerUseCase() {
  const gateway = new SupabaseAuthPlayerProvider();
  const playersRepository = new PrismaPlayersRepository();
  const rewardsRepository = new PrismaRewardsRepository();
  const sut = new GetRewardPlayerUseCase(gateway, playersRepository, rewardsRepository);
  return sut;
}
