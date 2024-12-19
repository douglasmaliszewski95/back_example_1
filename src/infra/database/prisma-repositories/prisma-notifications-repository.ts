import { Prisma } from "@prisma/client";
import { NotificationsRepository } from "../../../domain/notification/application/repositories/notifications-repository";
import {
  ListNotificationsResponseDTO,
  ListNotificationsParams,
  UpdateNotificationData
} from "../../../domain/notification/application/repositories/notifications-repository.types";
import { Notification } from "../../../domain/notification/enterprise/entities/notification";
import { PrismaNotificationsMapper } from "../mappers/prisma-notifications-mapper";
import { prisma } from "../prisma";
import { NotificationTypeEnum } from "../../../core/enums/notification-type-enum";

export class PrismaNotificationsRepository implements NotificationsRepository {
  async create(data: Notification): Promise<Notification> {
    const notification = await prisma.notification.create({
      data: PrismaNotificationsMapper.toPrisma(data)
    });

    return PrismaNotificationsMapper.toEntity(notification);
  }

  async findById(id: number): Promise<Notification | null> {
    const notification = await prisma.notification.findFirst({
      where: {
        id
      }
    });

    if (!notification) return null;

    return PrismaNotificationsMapper.toEntity(notification);
  }

  async update(id: number, data: UpdateNotificationData): Promise<Notification> {
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data
    });

    return PrismaNotificationsMapper.toEntity(updatedNotification);
  }

  async delete(id: number): Promise<void> {
    await prisma.$transaction([
      prisma.notificationTargetPoints.deleteMany({
        where: {
          notificationId: id
        }
      }),
      prisma.notificationRegistry.deleteMany({
        where: {
          notificationId: id
        }
      }),
      prisma.notification.delete({
        where: {
          id
        }
      })
    ]);
  }

  async list(params: ListNotificationsParams): Promise<ListNotificationsResponseDTO> {
    const filtersArray: Prisma.NotificationWhereInput[] = [];

    if (params.title) {
      filtersArray.push({ title: { contains: params.title, mode: "insensitive" } });
    }
    if (params.status) {
      filtersArray.push({ status: { in: params.status } });
    }
    if (params.tier) {
      const listTier = params.tier.split(",").map(tier => parseInt(tier));
      filtersArray.push({ tier: { hasSome: listTier } });
    }
    if (params.startDate) {
      filtersArray.push({ startDate: { gte: params.startDate } });
    }
    if (params.endDate) {
      filtersArray.push({ endDate: { lte: params.endDate } });
    }

    if (params.type) {
      filtersArray.push({ type: params.type });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        AND: filtersArray
      },
      orderBy: {
        id: "desc"
      },
      take: params.limit,
      skip: (params.page - 1) * params.limit
    });

    const total = await prisma.notification.count({
      where: {
        AND: filtersArray
      }
    });

    return {
      list: notifications.map(PrismaNotificationsMapper.toEntity),
      totalOfPages: Math.ceil(total / params.limit),
      total: total
    };
  }
}
