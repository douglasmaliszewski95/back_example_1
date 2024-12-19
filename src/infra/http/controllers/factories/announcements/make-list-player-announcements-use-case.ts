import { ListPlayerAnnouncementsUseCase } from "../../../../../domain/announcement/application/use-cases/list-player-announcements-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaAnnouncementsRepository } from "../../../../database/prisma-repositories/prisma-announcements-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeListPlayerAnnouncementsUseCase() {
  const announcementsRepository = new PrismaAnnouncementsRepository();
  const playersRepository = new PrismaPlayersRepository();
  const authProvider = new SupabaseAuthPlayerProvider();
  const sut = new ListPlayerAnnouncementsUseCase(announcementsRepository, playersRepository, authProvider);
  return sut;
}
