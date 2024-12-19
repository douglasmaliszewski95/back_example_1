import { Prisma, Notification as PrismaNotification } from "@prisma/client";
import { Notification } from "../../../domain/notification/enterprise/entities/notification";

export class PrismaNotificationsMapper {
  static toPrisma(notification: Notification): Prisma.NotificationUncheckedCreateInput {
    return {
      content: notification.content,
      title: notification.title,
      tier: notification.tier,
      status: notification.status,
      startDate: notification.startDate,
      endDate: notification.endDate,
      type: notification.type
    };
  }

  static toEntity(notification: PrismaNotification): Notification {
    return Notification.create({
      content: notification.content,
      title: notification.title,
      tier: notification.tier,
      status: notification.status,
      startDate: notification.startDate,
      endDate: notification.endDate,
      id: notification.id,
      type: notification.type
    });
  }
}
