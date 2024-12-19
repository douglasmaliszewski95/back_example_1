import { Prisma, NotificationAutomaticTemplates as PrismaNotificationAutomaticTemplate } from "@prisma/client";
import { NotificationAutomaticTemplate } from "../../../domain/notification/enterprise/entities/notification-automatic-template";
import { NotificationAutomaticTemplateResponse } from "../../../domain/notification/application/repositories/notification-automatic-template-repository.types";

export class PrismaNotificationAutomaticTemplateMapper {
  static toPrisma(
    notification: NotificationAutomaticTemplate
  ): Prisma.NotificationAutomaticTemplatesUncheckedCreateInput {
    return {
      type: notification.type,
      title: notification.title,
      content: notification.content,
      updatedBy: notification.updatedBy
    };
  }

  static toEntity(notification: PrismaNotificationAutomaticTemplate): NotificationAutomaticTemplate {
    return NotificationAutomaticTemplate.create({
      content: notification.content,
      title: notification.title,
      id: notification.id,
      type: notification.type,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      updatedBy: notification.updatedBy,
      active: notification.active
    });
  }

  static toNotificationAutomaticTemplateResponse(
    notification: PrismaNotificationAutomaticTemplate
  ): NotificationAutomaticTemplateResponse {
    return {
      content: notification.content,
      title: notification.title,
      id: notification.id,
      type: notification.type,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      updatedBy: notification.updatedBy,
      active: notification.active
    };
  }
}
