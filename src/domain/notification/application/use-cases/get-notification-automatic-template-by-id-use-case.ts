import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { NotificationAutomaticTemplateRepository } from "../repositories/notification-automatic-template-repository";
import { NotificationAutomaticTemplateResponse } from "../repositories/notification-automatic-template-repository.types";

export class GetNotificationAutomaticTemplateByIdUseCase {
  constructor(private readonly notificationAutomaticTemplateRepository: NotificationAutomaticTemplateRepository) {}

  execute = async (id: number): Promise<NotificationAutomaticTemplateResponse> => {
    const notificationTemplate = await this.notificationAutomaticTemplateRepository.findById(id);
    if (!notificationTemplate) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Notification template not found");
    }
    return notificationTemplate;
  };
}
