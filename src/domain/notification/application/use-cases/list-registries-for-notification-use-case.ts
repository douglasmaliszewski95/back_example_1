import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRegistry } from "../../enterprise/entities/notification-registry";
import { NotificationsRegistryRepository } from "../repositories/notifications-registry-repository";
import { NotificationRegistryPlayerData } from "../repositories/notifications-registry-repository.types";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface ListRegistriesForNotificationRequestDTO {
  page: number;
  limit: number;
}

interface ListRegistriesForNotificationResponseDTO {
  notification: Notification;
  result: Registries;
}

interface Registries {
  page: number;
  limit: number;
  total: number;
  totalOfPages: number;
  list: NotificationRegistryPlayerData[];
}

export class ListRegistriesForNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository, private notificationsRegistryRepository: NotificationsRegistryRepository) { }

  execute = async (notificationId: number, params: ListRegistriesForNotificationRequestDTO): Promise<ListRegistriesForNotificationResponseDTO> => {
    const notificationExists = await this.notificationsRepository.findById(notificationId);
    if (!notificationExists) throw new HttpException(HttpStatus.NOT_FOUND, "Notification not found");
    const registries = await this.notificationsRegistryRepository.list(notificationId, params);

    return {
      notification: notificationExists,
      result: {
        limit: params.limit,
        page: params.page,
        total: registries.total,
        totalOfPages: registries.totalOfPages,
        list: registries.list
      }
    }
  }
}