import { DeleteNotificationUseCase } from "../../../../../domain/notification/application/use-cases/delete-notification-use-case";
import { DeletePlayerNotificationUseCase } from "../../../../../domain/notification/application/use-cases/delete-player-notification-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaNotificationsRegistryRepository } from "../../../../database/prisma-repositories/prisma-notifications-registry-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeDeletePlayerNotificationUseCase() {
  const notificationRegistryRepo = new PrismaNotificationsRegistryRepository();
  const playersRepo = new PrismaPlayersRepository();
  const authPlayerProvider = new SupabaseAuthPlayerProvider();
  const sut = new DeletePlayerNotificationUseCase(notificationRegistryRepo, playersRepo, authPlayerProvider);
  return sut;
}
