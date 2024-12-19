import { GetNotificationByIdUseCase } from "../../../../../domain/notification/application/use-cases/get-notification-by-id-use-case";
import { PrismaNotificationsRepository } from "../../../../database/prisma-repositories/prisma-notifications-repository";

export function makeGetNotificationByIdUseCase() {
  const notificationsRepository = new PrismaNotificationsRepository();
  const sut = new GetNotificationByIdUseCase(notificationsRepository);
  return sut;
}