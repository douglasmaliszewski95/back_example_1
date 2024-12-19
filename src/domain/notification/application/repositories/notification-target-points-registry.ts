import {
  CreateNotificationTargetPointsDTO,
  NotificationTargetPoints
} from "./notification-target-points-registry.types";

export interface NotificationTargetPointsRepositoryRegistry {
  create(data: CreateNotificationTargetPointsDTO): Promise<void>;
  findByStartAndEndPoint(
    notificationId: number,
    startPoints: number,
    endPoints: number
  ): Promise<NotificationTargetPoints>;
}
