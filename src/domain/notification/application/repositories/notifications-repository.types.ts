import { NotificationStatus } from "../../../../core/enums/notification-status-enum";
import { NotificationTypeEnum } from "../../../../core/enums/notification-type-enum";
import { Notification } from "../../enterprise/entities/notification";

interface UpdateNotificationData {
  tier?: number[];
  title?: string;
  content?: string;
  startDate?: Date;
  endDate?: Date;
  status?: NotificationStatus;
}

interface Points {
  start: number;
  end: number;
}

interface ListNotificationsParams {
  page: number;
  limit: number;
  title?: string;
  tier?: string;
  status?: NotificationStatus[];
  startDate?: Date;
  endDate?: Date;
  type?: NotificationTypeEnum
}

interface ListNotificationsResponseDTO {
  total: number;
  totalOfPages: number;
  list: Notification[];
}

export { UpdateNotificationData, Points, ListNotificationsParams, ListNotificationsResponseDTO };
