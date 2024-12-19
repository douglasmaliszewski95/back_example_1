import { Prisma } from "@prisma/client";
import { NotificationStatusEnum } from "../../../core/enums/notification-status-enum";
import { NotificationsRegistryRepository } from "../../../domain/notification/application/repositories/notifications-registry-repository";
import {
  CountNotificationRegistryForPlayerParams,
  DeleteNotificationRegistryParams,
  ListNotificationRegistryForPlayerParams,
  ListNotificationRegistryForPlayerResponse,
  ListNotificationRegistryParams,
  ListNotificationRegistryResponse,
  ListNotificationWithPlayerData
} from "../../../domain/notification/application/repositories/notifications-registry-repository.types";
import { NotificationRegistry } from "../../../domain/notification/enterprise/entities/notification-registry";
import { PrismaNotificationsRegistryMapper } from "../mappers/prisma-notifications-registry-mapper";
import { prisma } from "../prisma";

export class PrismaNotificationsRegistryRepository implements NotificationsRegistryRepository {
  async createMany(notificationId: number, data: NotificationRegistry[]): Promise<NotificationRegistry[]> {
    const [, registries] = await prisma.$transaction([
      prisma.notificationRegistry.deleteMany({
        where: {
          notificationId: notificationId
        }
      }),
      prisma.notificationRegistry.createManyAndReturn({
        data: data.map(PrismaNotificationsRegistryMapper.toPrisma)
      })
    ]);
    return registries.map(PrismaNotificationsRegistryMapper.toEntity);
  }

  async create(data: NotificationRegistry): Promise<NotificationRegistry> {
    const registry = await prisma.notificationRegistry.create({
      data: PrismaNotificationsRegistryMapper.toPrisma(data)
    });

    return PrismaNotificationsRegistryMapper.toEntity(registry);
  }

  async findByNotificationIdAndRecipientId(
    notificationId: number,
    recipientId: string
  ): Promise<NotificationRegistry | null> {
    const registry = await prisma.notificationRegistry.findFirst({
      where: {
        notificationId,
        recipientId
      }
    });

    if (!registry) return null;

    return PrismaNotificationsRegistryMapper.toEntity(registry);
  }

  async list(
    notificationId: number,
    params: ListNotificationRegistryParams
  ): Promise<ListNotificationWithPlayerData> {
    const registries = await prisma.notificationRegistry.findMany({
      where: {
        notificationId
      },
      orderBy: {
        id: "desc"
      },
      take: params.limit,
      skip: (params.page - 1) * params.limit,
      include: {
        player: {
          select: {
            username: true,
            PlayerSeasonPoints: {
              select: {
                points: true,
                tier: true, 
                providerPlayerId: true,
                createdAt: true
              }
            }
          }
        }
      }
    });

    const total = await prisma.notificationRegistry.count({
      where: {
        notificationId
      }
    });

    return {
      total: total,
      totalOfPages: Math.ceil(total / params.limit),
      list: registries.map(x => {
        const tierPlayer = x.player.PlayerSeasonPoints.reduce((latest, current) => {return new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current});
        return {
          id: x.id,
          recipientId: x.recipientId,
          origin: x.origin,
          notificationId: x.notificationId,
          isRead: x.isRead,
          username: x.player.username as string,
          points: x.player.PlayerSeasonPoints.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0),
          tier: tierPlayer.tier,
          isDeleted: x.isDeleted,
          readAt: x.readAt
        }
      })
    };
  }

  async delete({ notificationId, ...params }: DeleteNotificationRegistryParams): Promise<void> {
    await prisma.notificationRegistry.deleteMany({
      where: {
        notificationId,
        ...params
      }
    });
  }

  async deletePlayerRegistries(providerPlayerId: string): Promise<void> {
    await prisma.notificationRegistry.deleteMany({
      where: {
        recipientId: providerPlayerId
      }
    });
  }

  async findByRecipientId(recipientId: string): Promise<NotificationRegistry[]> {
    const registries = await prisma.notificationRegistry.findMany({
      where: {
        recipientId
      }
    });

    return registries.map(PrismaNotificationsRegistryMapper.toEntity);
  }

  async listForPlayer(
    recipientId: string,
    params: ListNotificationRegistryForPlayerParams
  ): Promise<ListNotificationRegistryForPlayerResponse> {
    const whereInput: Prisma.NotificationRegistryWhereInput = {
      recipientId,
      isDeleted: params.isDeleted,
      notification: {
        status: params.notificationStatus,
        startDate: {
          lte: params.notificationStartDate
        }
      }
    };

    const [notifications, total] = await Promise.all([
      prisma.notificationRegistry.findMany({
        where: whereInput,
        orderBy: {
          notification: {
            startDate: "desc"
          }
        },
        take: params.limit,
        skip: (params.page - 1) * params.limit,
        include: {
          notification: true
        }
      }),
      prisma.notificationRegistry.count({
        where: whereInput
      })
    ]);

    return {
      total: total,
      totalOfPages: Math.ceil(total / params.limit),
      list: notifications.map(({ notification, isRead, isDeleted, readAt }) => ({
        ...notification,
        isRead,
        isDeleted,
        readAt
      }))
    };
  }

  async update(registryId: number, data: Partial<NotificationRegistry>): Promise<NotificationRegistry> {
    const updatedRegistry = await prisma.notificationRegistry.update({
      where: {
        id: registryId
      },
      data
    });

    return PrismaNotificationsRegistryMapper.toEntity(updatedRegistry);
  }

  async updateManyByNotificationIdsAndPlayerProviderId(
    notificationIds: number[],
    providerPlayerId: string,
    data: Partial<NotificationRegistry>
  ): Promise<void> {
    await prisma.notificationRegistry.updateMany({
      where: {
        notificationId: {
          in: notificationIds
        },
        recipientId: providerPlayerId
      },
      data
    });
  }

  async countForPlayer(recipientId: string, params: CountNotificationRegistryForPlayerParams): Promise<number> {
    const whereInput: Prisma.NotificationRegistryWhereInput = {
      recipientId,
      isRead: params.isRead,
      isDeleted: params.isDeleted,
      notification: {
        status: params.notificationStatus,
        startDate: {
          lte: params.notificationStartDate
        }
      }
    };

    const total = await prisma.notificationRegistry.count({
      where: whereInput
    });

    return total;
  }
}
