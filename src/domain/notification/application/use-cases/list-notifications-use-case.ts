import { NotificationStatus } from "../../../../core/enums/notification-status-enum";
import { NotificationTypeEnum } from "../../../../core/enums/notification-type-enum";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface ListNotificationsRequestDTO {
  page: number;
  limit: number;
  title?: string;
  tier?: string;
  status?: NotificationStatus[];
  startDate?: Date;
  endDate?: Date;
}

interface ListNotificationsResponseDTO {
  page: number;
  total: number;
  limit: number;
  list: Notification[];
}

export class ListNotificationsUseCase {
  constructor(private notificationsRepository: NotificationsRepository) { }

  execute = async (params: ListNotificationsRequestDTO): Promise<ListNotificationsResponseDTO> => {
    const notifications = await this.notificationsRepository.list({
      ...params,
      type: NotificationTypeEnum.MANUAL
    });

    return {
      limit: params.limit,
      page: params.page,
      total: notifications.total,
      list: notifications.list
    };
  };
}
