import { NotificationStatus } from "../../../../core/enums/notification-status-enum";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRegistry } from "../../enterprise/entities/notification-registry";

interface ListNotificationRegistryParams {
  page: number;
  limit: number;
}

interface NotificationRegistryPlayerData {
  id?: number;
  recipientId: string;
  origin: string;
  notificationId: number;
  isRead?: boolean;
  username: string;
  points: number;
  tier: number;
  isDeleted?: boolean;
  readAt?: Date | null;
}

interface ListNotificationWithPlayerData {
  total: number;
  totalOfPages: number;
  list: NotificationRegistryPlayerData[];
}

interface ListNotificationRegistryResponse {
  total: number;
  totalOfPages: number;
  list: NotificationRegistry[];
}

interface ListNotificationRegistryForPlayerParams {
  page: number;
  limit: number;
  isDeleted?: boolean;
  notificationStatus?: NotificationStatus;
  notificationStartDate?: Date;
}

interface CountNotificationRegistryForPlayerParams {
  isRead?: boolean;
  isDeleted?: boolean;
  notificationStatus?: NotificationStatus;
  notificationStartDate?: Date;
}

type NotificationRegistryForPlayer = Omit<Notification, "props"> &
  Pick<NotificationRegistry, "isRead" | "isDeleted" | "readAt">;

interface ListNotificationRegistryForPlayerResponse {
  total: number;
  totalOfPages: number;
  list: NotificationRegistryForPlayer[];
}

interface DeleteNotificationRegistryParams {
  notificationId: number;
  recipientId?: string;
}

export {
  ListNotificationRegistryParams,
  ListNotificationRegistryResponse,
  DeleteNotificationRegistryParams,
  ListNotificationRegistryForPlayerResponse,
  ListNotificationRegistryForPlayerParams,
  NotificationRegistryForPlayer,
  CountNotificationRegistryForPlayerParams,
  ListNotificationWithPlayerData,
  NotificationRegistryPlayerData
};
