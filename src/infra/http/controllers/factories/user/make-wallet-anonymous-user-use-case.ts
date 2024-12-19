import { WalletAnonymousUserUseCase } from "../../../../../domain/user/application/use-cases/user/wallet-anonymous-user-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeWalletAnonymousUserUseCase() {
  const gateway = new SupabaseAuthPlayerProvider();
  const playersRepository = new PrismaPlayersRepository();
  const sut = new WalletAnonymousUserUseCase(gateway, playersRepository);
  return sut;
}