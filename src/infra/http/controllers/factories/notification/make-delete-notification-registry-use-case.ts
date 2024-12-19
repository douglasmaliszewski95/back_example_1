import { DeleteNotificationRegistryUseCase } from "../../../../../domain/notification/application/use-cases/delete-notification-registry-use-case";
import { DeleteNotificationUseCase } from "../../../../../domain/notification/application/use-cases/delete-notification-use-case";
import { PrismaNotificationsRegistryRepository } from "../../../../database/prisma-repositories/prisma-notifications-registry-repository";
import { PrismaNotificationsRepository } from "../../../../database/prisma-repositories/prisma-notifications-repository";

export function makeDeleteNotificationRegistryUseCase() {
  const notificationRepo = new PrismaNotificationsRepository();
  const notificationRegistryRepo = new PrismaNotificationsRegistryRepository();
  const sut = new DeleteNotificationRegistryUseCase(notificationRepo, notificationRegistryRepo);
  return sut;
}
