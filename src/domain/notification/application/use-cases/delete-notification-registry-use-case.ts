import { NotificationStatusEnum } from "../../../../core/enums/notification-status-enum";
import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { NotificationsRegistryRepository } from "../repositories/notifications-registry-repository";
import { NotificationsRepository } from "../repositories/notifications-repository";

export class DeleteNotificationRegistryUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
    private notificationsRegistryRepository: NotificationsRegistryRepository
  ) {}

  execute = async (notificationId: number, providerPlayerId?: string): Promise<void> => {
    const notificationExists = await this.notificationsRepository.findById(notificationId);
    if (!notificationExists) throw new HttpException(HttpStatus.NOT_FOUND, "invalid notification");
    const notificationStatus = notificationExists.status;
    if (notificationStatus === NotificationStatusEnum.ACTIVE)
      throw new HttpException(HttpStatus.BAD_REQUEST, "notification is already active");
    await this.notificationsRegistryRepository.delete({
      notificationId,
      recipientId: providerPlayerId
    });
  };
}
