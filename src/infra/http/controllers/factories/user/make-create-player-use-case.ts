import { CreatePlayerUseCase } from "../../../../../domain/user/application/use-cases/user/create-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeCreatePlayerUseCase() {
  const authProvider = new SupabaseAuthPlayerProvider();
  const playersRepository = new PrismaPlayersRepository();
  const sut = new CreatePlayerUseCase(authProvider, playersRepository);
  return sut;
} 