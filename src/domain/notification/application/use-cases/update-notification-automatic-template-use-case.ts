import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { AuthAdminProvider } from "../../../user/application/auth-provider/auth-admin-provider";
import { NotificationAutomaticTemplateRepository } from "../repositories/notification-automatic-template-repository";
import { NotificationAutomaticTemplateResponse } from "../repositories/notification-automatic-template-repository.types";

interface UpdateNotificationAutomaticTemplateRequestDTO {
  title?: string;
  content?: string;
}

export class UpdateNotificationAutomaticTemplateUseCase {
  constructor(
    private readonly notificationAutomaticTemplateRepository: NotificationAutomaticTemplateRepository,
    private readonly authAdminProvider: AuthAdminProvider
  ) {}

  execute = async (
    accessToken: string,
    id: number,
    data: UpdateNotificationAutomaticTemplateRequestDTO
  ): Promise<NotificationAutomaticTemplateResponse> => {
    const admin = await this.authAdminProvider.getAdmin(accessToken);

    if (!admin || !admin.fullname) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Invalid token");
    }

    const notificationTemplate = await this.notificationAutomaticTemplateRepository.findById(id);
    if (!notificationTemplate) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Notification template not found");
    }
    const updatedNotificationTemplate = await this.notificationAutomaticTemplateRepository.update(id, {
      ...data,
      updatedBy: admin.fullname
    });
    return updatedNotificationTemplate;
  };
}
