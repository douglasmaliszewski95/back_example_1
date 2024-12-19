import { InvitePlayerUseCase } from "../../../../../domain/user/application/use-cases/user/invite-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaInvitedPlayersRepository } from "../../../../database/prisma-repositories/prisma-invited-players-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeInvitePlayerUseCase() {
  const authProvider = new SupabaseAuthPlayerProvider();
  const playerRepository = new PrismaPlayersRepository();
  const invitedPlayersRepository = new PrismaInvitedPlayersRepository();
  const sut = new InvitePlayerUseCase(authProvider, playerRepository, invitedPlayersRepository);

  return sut;
}
