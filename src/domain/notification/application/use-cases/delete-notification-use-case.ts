import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { NotificationsRepository } from "../repositories/notifications-repository";

export class DeleteNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  execute = async (notificationId: number): Promise<void> => {
    const notificationExists = await this.notificationsRepository.findById(notificationId);
    if (!notificationExists) throw new HttpException(HttpStatus.NOT_FOUND, "invalid notification");
    await this.notificationsRepository.delete(notificationId);
  };
}
