import { NotificationTargetPointsRepositoryRegistry } from "../../../domain/notification/application/repositories/notification-target-points-registry";
import {
  CreateNotificationTargetPointsDTO,
  NotificationTargetPoints
} from "../../../domain/notification/application/repositories/notification-target-points-registry.types";
import { prisma } from "../prisma";

export class PrismaNotificationTargetPointsRegistryRepository implements NotificationTargetPointsRepositoryRegistry {
  async create(data: CreateNotificationTargetPointsDTO): Promise<void> {
    await prisma.$transaction([
      prisma.notificationTargetPoints.deleteMany({
        where: {
          notificationId: data.notificationId
        }
      }),
      prisma.notificationTargetPoints.createMany({
        data: (data.points || []).map(point => ({
          notificationId: data.notificationId,
          startPoints: point.start,
          endPoints: point.end
        }))
      })
    ]);
  }

  async findByStartAndEndPoint(
    notificationId: number,
    startPoints: number,
    endPoints: number
  ): Promise<NotificationTargetPoints> {
    throw new Error("Method not implemented.");
  }
}
