import { ListPlayerNotificationsUseCase } from "../../../../../domain/notification/application/use-cases/list-player-notifications-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaNotificationsRegistryRepository } from "../../../../database/prisma-repositories/prisma-notifications-registry-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeListPlayerNotificationsUseCase() {
  const notificationsRegistryRepository = new PrismaNotificationsRegistryRepository();
  const playersRepository = new PrismaPlayersRepository();
  const authProvider = new SupabaseAuthPlayerProvider();
  const sut = new ListPlayerNotificationsUseCase(notificationsRegistryRepository, playersRepository, authProvider);
  return sut;
}
