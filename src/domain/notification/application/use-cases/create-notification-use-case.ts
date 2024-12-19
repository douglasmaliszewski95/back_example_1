import { NotificationsRepository } from "../repositories/notifications-repository";
import { Notification } from "../../enterprise/entities/notification";
import { VerifyNotificationDateBaseHandler } from "../validations/verify-notification-date/verify-notification-date-base-handler";
import { NotificationStatusEnum } from "../../../../core/enums/notification-status-enum";
import { NotificationTypeEnum } from "../../../../core/enums/notification-type-enum";

interface CreateNotificationRequestDTO {
  title: string;
  content: string;
  startDate?: Date;
  endDate?: Date;
}

interface CreateNotificationResponseDTO {
  notification: Notification;
}

export class CreateNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) { }

  execute = async (data: CreateNotificationRequestDTO): Promise<CreateNotificationResponseDTO> => {
    if (data.startDate) {
      const validateNotificationDate = new VerifyNotificationDateBaseHandler();
      validateNotificationDate.validate(data.startDate, data.endDate);
    }

    const notification = Notification.create({
      tier: [],
      status: NotificationStatusEnum.DRAFT,
      type: NotificationTypeEnum.MANUAL,
      ...data
    });

    const registeredNotification = await this.notificationsRepository.create(notification);

    return { notification: registeredNotification };
  };
}
