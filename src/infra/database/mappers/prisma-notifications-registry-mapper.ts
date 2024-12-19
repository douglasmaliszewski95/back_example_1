import { Prisma, NotificationRegistry as PrismaNotificationRegistry } from "@prisma/client";
import { NotificationRegistry } from "../../../domain/notification/enterprise/entities/notification-registry";

export class PrismaNotificationsRegistryMapper {
  static toPrisma(notificationRegistry: NotificationRegistry): Prisma.NotificationRegistryUncheckedCreateInput {
    return {
      notificationId: notificationRegistry.notificationId,
      origin: notificationRegistry.origin,
      recipientId: notificationRegistry.recipientId,
      isDeleted: notificationRegistry.isDeleted,
      isRead: notificationRegistry.isRead,
      readAt: notificationRegistry.readAt,
      id: notificationRegistry.id
    };
  }

  static toEntity(notificationRegistry: PrismaNotificationRegistry): NotificationRegistry {
    return NotificationRegistry.create({
      notificationId: notificationRegistry.notificationId,
      origin: notificationRegistry.origin,
      recipientId: notificationRegistry.recipientId,
      isDeleted: notificationRegistry.isDeleted,
      isRead: notificationRegistry.isRead,
      readAt: notificationRegistry.readAt,
      id: notificationRegistry.id
    });
  }
}
