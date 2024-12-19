import { UserHasWalletUseCase } from "../../../../../domain/user/application/use-cases/user/user-has-wallet-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeUserHasWalletUseCase() {
  const gateway = new SupabaseAuthPlayerProvider();
  const playersRepository = new PrismaPlayersRepository();
  const sut = new UserHasWalletUseCase(gateway, playersRepository);
  return sut;
}
