import { GetNotificationAutomaticTemplateByIdUseCase } from "../../../../../domain/notification/application/use-cases/get-notification-automatic-template-by-id-use-case";
import { PrismaNotificationAutomaticTemplateRepository } from "../../../../database/prisma-repositories/prisma-notification-automatic-template-repository";

export function makeGetNotificationAutomaticTemplateByIdUseCase() {
  const notificationAutomaticTemplateRepository = new PrismaNotificationAutomaticTemplateRepository();
  return new GetNotificationAutomaticTemplateByIdUseCase(notificationAutomaticTemplateRepository);
}
