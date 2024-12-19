import { UpdateNotificationAutomaticTemplateUseCase } from "../../../../../domain/notification/application/use-cases/update-notification-automatic-template-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";
import { PrismaNotificationAutomaticTemplateRepository } from "../../../../database/prisma-repositories/prisma-notification-automatic-template-repository";

export function makeUpdateNotificationAutomaticTemplateUseCase() {
  const notificationAutomaticTemplateRepository = new PrismaNotificationAutomaticTemplateRepository();
  const authAdminProvider = new SupabaseAuthAdminProvider();
  return new UpdateNotificationAutomaticTemplateUseCase(notificationAutomaticTemplateRepository, authAdminProvider);
}
