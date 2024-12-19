import { NotificationTargetPointsRepositoryRegistry } from "../../src/domain/notification/application/repositories/notification-target-points-registry";
import {
  CreateNotificationTargetPointsDTO,
  NotificationTargetPoints
} from "../../src/domain/notification/application/repositories/notification-target-points-registry.types";

export class NotificationTargetPointsRepository implements NotificationTargetPointsRepositoryRegistry {
  targetPoints: NotificationTargetPoints[] = [];

  async create(data: CreateNotificationTargetPointsDTO): Promise<void> {
    for (const targetPoint of data.points) {
      this.targetPoints.push({
        endPoints: targetPoint.end,
        startPoints: targetPoint.start,
        notificationId: data.notificationId
      });
    }
  }

  async findByStartAndEndPoint(
    notificationId: number,
    startPoints: number,
    endPoints: number
  ): Promise<NotificationTargetPoints> {
    throw new Error("Method not implemented.");
  }
}
