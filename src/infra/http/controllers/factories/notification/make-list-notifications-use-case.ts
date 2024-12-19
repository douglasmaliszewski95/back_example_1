import { ListNotificationsUseCase } from "../../../../../domain/notification/application/use-cases/list-notifications-use-case";
import { PrismaNotificationsRepository } from "../../../../database/prisma-repositories/prisma-notifications-repository";

export function makeListNotificationsUseCase() {
  const notificationsRepository = new PrismaNotificationsRepository();
  const sut = new ListNotificationsUseCase(notificationsRepository);
  return sut;
}