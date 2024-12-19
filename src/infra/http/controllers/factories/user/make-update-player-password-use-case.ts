import { UpdatePlayerPasswordUseCase } from "../../../../../domain/user/application/use-cases/user/update-player-password-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeUpdatePlayerPasswordUseCase() {
  const gateway = new SupabaseAuthPlayerProvider();
  const provider = new PrismaPlayersRepository();
  const sut = new UpdatePlayerPasswordUseCase(gateway, provider);
  return sut;
}
