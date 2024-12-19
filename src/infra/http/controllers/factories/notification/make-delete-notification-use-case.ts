import { DeleteNotificationUseCase } from "../../../../../domain/notification/application/use-cases/delete-notification-use-case";
import { PrismaNotificationsRepository } from "../../../../database/prisma-repositories/prisma-notifications-repository";

export function makeDeleteNotificationUseCase() {
  const notificationRepo = new PrismaNotificationsRepository();
  const sut = new DeleteNotificationUseCase(notificationRepo);
  return sut;
}
