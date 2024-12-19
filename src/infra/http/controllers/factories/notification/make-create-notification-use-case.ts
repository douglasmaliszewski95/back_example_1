import { CreateNotificationUseCase } from "../../../../../domain/notification/application/use-cases/create-notification-use-case";
import { PrismaNotificationsRepository } from "../../../../database/prisma-repositories/prisma-notifications-repository";

export function makeCreateNotificationUseCase() {
  const notificationRepo = new PrismaNotificationsRepository();
  const sut = new CreateNotificationUseCase(notificationRepo);
  return sut;
}