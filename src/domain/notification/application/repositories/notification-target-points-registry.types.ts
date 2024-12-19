import { Points } from "./notifications-repository.types";

interface CreateNotificationTargetPointsDTO {
  notificationId: number;
  points: Partial<Points>[];
}

interface NotificationTargetPoints {
  notificationId: number;
  startPoints?: number;
  endPoints?: number;
}

export { CreateNotificationTargetPointsDTO, NotificationTargetPoints };
