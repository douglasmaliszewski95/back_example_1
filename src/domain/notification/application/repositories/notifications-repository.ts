import { Notification } from "../../enterprise/entities/notification";
import {
  ListNotificationsResponseDTO,
  ListNotificationsParams,
  UpdateNotificationData
} from "./notifications-repository.types";

export interface NotificationsRepository {
  create(data: Notification): Promise<Notification>;
  findById(id: number): Promise<Notification | null>;
  update(id: number, data: UpdateNotificationData): Promise<Notification>;
  list(params: ListNotificationsParams): Promise<ListNotificationsResponseDTO>;
  delete(id: number): Promise<void>;
}
