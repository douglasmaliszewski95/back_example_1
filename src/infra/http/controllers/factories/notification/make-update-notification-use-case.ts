import { UpdateNotificationUseCase } from "../../../../../domain/notification/application/use-cases/update-notification-use-case";
import { PrismaNotificationsRepository } from "../../../../database/prisma-repositories/prisma-notifications-repository";

export function makeUpdateNotificationController() {
  const notificationRepo = new PrismaNotificationsRepository();
  const sut = new UpdateNotificationUseCase(notificationRepo);
  return sut;
}
