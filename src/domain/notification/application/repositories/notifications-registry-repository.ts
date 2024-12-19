import { NotificationRegistry } from "../../enterprise/entities/notification-registry";
import {
  DeleteNotificationRegistryParams,
  ListNotificationRegistryForPlayerResponse,
  ListNotificationRegistryForPlayerParams,
  ListNotificationRegistryParams,
  ListNotificationRegistryResponse,
  CountNotificationRegistryForPlayerParams,
  ListNotificationWithPlayerData
} from "./notifications-registry-repository.types";

export interface NotificationsRegistryRepository {
  create(data: NotificationRegistry): Promise<NotificationRegistry>;
  createMany(notificationId: number, data: NotificationRegistry[]): Promise<NotificationRegistry[]>;
  findByNotificationIdAndRecipientId(notificationId: number, recipientId: string): Promise<NotificationRegistry | null>;
  findByRecipientId(recipientId: string): Promise<NotificationRegistry[]>;
  list(notificationId: number, params: ListNotificationRegistryParams): Promise<ListNotificationWithPlayerData>;
  delete(params: DeleteNotificationRegistryParams): Promise<void>;
  deletePlayerRegistries(providerPlayerId: string): Promise<void>;
  listForPlayer(
    recipientId: string,
    params: ListNotificationRegistryForPlayerParams
  ): Promise<ListNotificationRegistryForPlayerResponse>;
  countForPlayer(recipientId: string, params: CountNotificationRegistryForPlayerParams): Promise<number>;
  update(registryId: number, data: Partial<NotificationRegistry>): Promise<NotificationRegistry>;
  updateManyByNotificationIdsAndPlayerProviderId(
    notificationIds: number[],
    playerProviderId: string,
    data: Partial<NotificationRegistry>
  ): Promise<void>;
}
