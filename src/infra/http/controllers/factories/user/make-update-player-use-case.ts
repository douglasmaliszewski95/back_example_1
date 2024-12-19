import { UpdatePlayerUseCase } from "../../../../../domain/user/application/use-cases/user/update-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeUpdatePlayerUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const authProvider = new SupabaseAuthPlayerProvider();
  const sut = new UpdatePlayerUseCase(playersRepository, authProvider);
  return sut;
}