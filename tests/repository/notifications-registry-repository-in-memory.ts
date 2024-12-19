import { randomInt } from "node:crypto";
import { NotificationsRegistryRepository } from "../../src/domain/notification/application/repositories/notifications-registry-repository";
import { NotificationRegistry } from "../../src/domain/notification/enterprise/entities/notification-registry";
import {
  CountNotificationRegistryForPlayerParams,
  DeleteNotificationRegistryParams,
  ListNotificationRegistryForPlayerParams,
  ListNotificationRegistryForPlayerResponse,
  ListNotificationRegistryParams,
  ListNotificationRegistryResponse,
  ListNotificationWithPlayerData,
  NotificationRegistryForPlayer
} from "../../src/domain/notification/application/repositories/notifications-registry-repository.types";
import { makeNotification } from "../factories/make-notification";

export class NotificationsRegistryRepositoryInMemory implements NotificationsRegistryRepository {
  notificationRegistry: NotificationRegistry[] = [];

  async create(data: NotificationRegistry): Promise<NotificationRegistry> {
    data.id = data.id || randomInt(9999);
    this.notificationRegistry.push(data);
    return data;
  }

  async createMany(notificationId: number, data: NotificationRegistry[]): Promise<NotificationRegistry[]> {
    this.notificationRegistry = this.notificationRegistry.filter(
      registry => registry.notificationId !== notificationId
    );
    this.notificationRegistry.push(...data);
    return data;
  }

  async findByNotificationIdAndRecipientId(
    notificationId: number,
    recipientId: string
  ): Promise<NotificationRegistry | null> {
    const registry = await this.notificationRegistry.find(
      registry => registry.notificationId === notificationId && registry.recipientId === recipientId
    );
    if (!registry) return null;
    return registry;
  }

  async list(
    notificationId: number,
    params: ListNotificationRegistryParams
  ): Promise<ListNotificationWithPlayerData> {
    const { limit, page } = params;
    const registries = await this.notificationRegistry.filter(registry => registry.notificationId === notificationId);

    const totalRecords = registries.length;
    const registriesList = registries.slice((page - 1) * limit, page * limit);

    return {
      list: registriesList.map(x => {
        return {
          id: x.id,
          recipientId: x.recipientId,
          origin: x.origin,
          notificationId: x.notificationId,
          isRead: x.isRead,
          username: "username",
          points: 0,
          tier: 3,
          isDeleted: x.isDeleted,
          readAt: x.readAt
        }
      }),
      total: totalRecords,
      totalOfPages: Math.ceil(totalRecords / limit)
    };
  }

  async delete(params: DeleteNotificationRegistryParams): Promise<void> {
    if (params.recipientId) {
      this.notificationRegistry = this.notificationRegistry.filter(
        registry => registry.notificationId === params.notificationId && registry.recipientId !== params.recipientId
      );
    } else {
      this.notificationRegistry = this.notificationRegistry.filter(
        registry => registry.notificationId !== params.notificationId
      );
    }
  }

  async deletePlayerRegistries(providerPlayerId: string): Promise<void> {
    this.notificationRegistry = this.notificationRegistry.filter(registry => registry.recipientId !== providerPlayerId);
  }

  async findByRecipientId(recipientId: string): Promise<NotificationRegistry[]> {
    return this.notificationRegistry.filter(registry => registry.recipientId === recipientId);
  }

  async listForPlayer(
    recipientId: string,
    params: ListNotificationRegistryForPlayerParams
  ): Promise<ListNotificationRegistryForPlayerResponse> {
    const registryByRecipientId = this.notificationRegistry.filter(
      registry => registry.recipientId === recipientId && registry.isDeleted === params.isDeleted
    );
    const paginatedRegistries = registryByRecipientId.slice(
      (params.page - 1) * params.limit,
      params.page * params.limit
    );

    const registries = paginatedRegistries.map(({ isRead, isDeleted, readAt }) => {
      const notification = makeNotification({
        id: 1
      });
      return {
        ...notification,
        isRead,
        isDeleted,
        readAt
      };
    }) as NotificationRegistryForPlayer[];

    return {
      list: registries,
      total: registryByRecipientId.length,
      totalOfPages: Math.ceil(registryByRecipientId.length / params.limit)
    };
  }

  async update(registryId: number, data: Partial<NotificationRegistry>): Promise<NotificationRegistry> {
    const notificationRegistryIndex = this.notificationRegistry.findIndex(item => item.id === registryId);
    const notificationRegistry = this.notificationRegistry[notificationRegistryIndex];
    if (data.isDeleted) notificationRegistry.isDeleted = data.isDeleted;
    if (data.isRead) notificationRegistry.isRead = data.isRead;
    if (data.readAt) notificationRegistry.readAt = data.readAt;
    return notificationRegistry;
  }

  async updateManyByNotificationIdsAndPlayerProviderId(
    notificationIds: number[],
    playerProviderId: string,
    data: Partial<NotificationRegistry>
  ): Promise<void> {
    const filteredByNotificationIds = this.notificationRegistry.filter(registry =>
      notificationIds.includes(registry.notificationId)
    );
    const filterByProviderPlayerId = filteredByNotificationIds.filter(
      registry => registry.recipientId === playerProviderId
    );
    for (const registry of filterByProviderPlayerId) {
      const notificationRegistryIndex = this.notificationRegistry.findIndex(item => item.id === registry.id);
      const notificationRegistry = this.notificationRegistry[notificationRegistryIndex];
      if (data.isDeleted) notificationRegistry.isDeleted = data.isDeleted;
      if (data.isRead) notificationRegistry.isRead = data.isRead;
      if (data.readAt) notificationRegistry.readAt = data.readAt;
    }
  }

  async countForPlayer(recipientId: string, params: CountNotificationRegistryForPlayerParams): Promise<number> {
    const registries = this.notificationRegistry.filter(
      registry =>
        registry.recipientId === recipientId &&
        registry.isRead === params.isRead &&
        registry.isDeleted === params.isDeleted
    );
    return registries.length;
  }
}
