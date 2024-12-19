import { ListRegistriesForNotificationUseCase } from "../../../../../domain/notification/application/use-cases/list-registries-for-notification-use-case";
import { PrismaNotificationsRegistryRepository } from "../../../../database/prisma-repositories/prisma-notifications-registry-repository";
import { PrismaNotificationsRepository } from "../../../../database/prisma-repositories/prisma-notifications-repository";

export function makeListRegistriesForNotificationUseCase() {
  const notificationsRegistryRepository = new PrismaNotificationsRegistryRepository();
  const notificationRepo = new PrismaNotificationsRepository();
  const sut = new ListRegistriesForNotificationUseCase(notificationRepo, notificationsRegistryRepository);
  return sut;
}