import { NotificationStatusEnum } from "../../../../core/enums/notification-status-enum";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface UpdateNotificationRequestDTO {
  isDraft: boolean;
  title?: string;
  content?: string;
  startDate?: Date;
  endDate?: Date;
}

export class UpdateNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) { }

  public execute = async (
    notificationId: number,
    { isDraft, ...data }: UpdateNotificationRequestDTO
  ): Promise<Notification> => {
    const notificationExists = await this.notificationsRepository.findById(notificationId);
    if (!notificationExists) throw new HttpException(HttpStatus.NOT_FOUND, "invalid notification");
    const notificationStatus = notificationExists.status;
    if (notificationStatus === NotificationStatusEnum.ACTIVE)
      throw new HttpException(HttpStatus.BAD_REQUEST, "notification is already active");
    const updatedNotification = await this.notificationsRepository.update(notificationId, {
      ...data,
      status: isDraft ? NotificationStatusEnum.DRAFT : NotificationStatusEnum.ACTIVE
    });
    return updatedNotification;
  };
}
