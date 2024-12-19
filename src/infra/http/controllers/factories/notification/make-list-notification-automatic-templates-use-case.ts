import { ListNotificationAutomaticTemplatesUseCase } from "../../../../../domain/notification/application/use-cases/list-notification-automatic-templates-use-case";
import { PrismaNotificationAutomaticTemplateRepository } from "../../../../database/prisma-repositories/prisma-notification-automatic-template-repository";

export function makeListNotificationAutomaticTemplatesUseCase() {
  const notificationAutomaticTemplatesRepository = new PrismaNotificationAutomaticTemplateRepository();
  return new ListNotificationAutomaticTemplatesUseCase(notificationAutomaticTemplatesRepository);
}
