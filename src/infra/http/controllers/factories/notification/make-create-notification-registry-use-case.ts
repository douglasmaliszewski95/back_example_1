import { CreateNotificationRegistryUseCase } from "../../../../../domain/notification/application/use-cases/create-notification-registry-use-case";
import { PrismaNotificationTargetPointsRegistryRepository } from "../../../../database/prisma-repositories/prisma-notification-target-points-registry-repository";
import { PrismaNotificationsRegistryRepository } from "../../../../database/prisma-repositories/prisma-notifications-registry-repository";
import { PrismaNotificationsRepository } from "../../../../database/prisma-repositories/prisma-notifications-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PrismaSeasonsRepository } from "../../../../database/prisma-repositories/prisma-seasons-repository";

export function makeCreateNotificationRegistryUseCase() {
  const notificationsRegistryRepository = new PrismaNotificationsRegistryRepository();
  const notificationsRepository = new PrismaNotificationsRepository();
  const playersRepository = new PrismaPlayersRepository();
  const notificationTargetPointsRegistryRepository = new PrismaNotificationTargetPointsRegistryRepository();
  const seasonRepository = new PrismaSeasonsRepository();
  const sut = new CreateNotificationRegistryUseCase(
    notificationsRegistryRepository,
    notificationsRepository,
    playersRepository,
    notificationTargetPointsRegistryRepository,
    seasonRepository
  );
  return sut;
}
