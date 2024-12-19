import { DeletePlayerUseCase } from "../../../../../domain/user/application/use-cases/user/delete-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeDeletePlayerUsecase() {
  const authPlayerProvider = new SupabaseAuthPlayerProvider();
  const playersRepository = new PrismaPlayersRepository();
  const sut = new DeletePlayerUseCase(authPlayerProvider, playersRepository);
  return sut;
}