import { NotificationStatus } from "../../../../core/enums/notification-status-enum";
import { NotificationType } from "../../../../core/enums/notification-type-enum";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { NotificationsRepository } from "../repositories/notifications-repository";
interface GetNotificationByIdResponseDTO {
  id: number;
  tier: number[];
  title: string;
  content: string;
  status: NotificationStatus;
  type: NotificationType;
  startDate?: Date | null;
  endDate?: Date | null;
}

export class GetNotificationByIdUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  execute = async (notificationId: number): Promise<GetNotificationByIdResponseDTO> => {
    const notificationExists = await this.notificationsRepository.findById(notificationId);
    if (!notificationExists) throw new HttpException(HttpStatus.NOT_FOUND, "Notification not found");

    return {
      id: notificationExists.id as number,
      tier: notificationExists.tier,
      title: notificationExists.title,
      content: notificationExists.content,
      status: notificationExists.status,
      type: notificationExists.type,
      startDate: notificationExists.startDate,
      endDate: notificationExists.endDate
    };
  };
}
