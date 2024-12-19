import { InsertBulltapPlayerUseCase } from "../../../../../domain/user/application/use-cases/user/insert-bulltap-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PrismaSystemRepository } from "../../../../database/prisma-repositories/prisma-system-repository";

export function makeInsertBulltapPlayerUseCase() {
  const gateway = new SupabaseAuthPlayerProvider();
  const playersRepository = new PrismaPlayersRepository();
  const systemsRepository = new PrismaSystemRepository();
  const sut = new InsertBulltapPlayerUseCase(gateway, playersRepository, systemsRepository);
  return sut;
}
