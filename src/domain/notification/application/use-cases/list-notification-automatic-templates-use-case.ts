import { NotificationAutomaticTemplateRepository } from "../repositories/notification-automatic-template-repository";
import { NotificationAutomaticTemplateResponse } from "../repositories/notification-automatic-template-repository.types";

interface ListNotificationAutomaticTemplatesRequestDTO {
  page: number;
  limit: number;
}

interface ListNotificationAutomaticTemplatesResponseDTO {
  page: number;
  total: number;
  limit: number;
  list: NotificationAutomaticTemplateResponse[];
}

export class ListNotificationAutomaticTemplatesUseCase {
  constructor(private readonly notificationAutomaticTemplateRepository: NotificationAutomaticTemplateRepository) {}

  execute = async (
    params: ListNotificationAutomaticTemplatesRequestDTO
  ): Promise<ListNotificationAutomaticTemplatesResponseDTO> => {
    const templates = await this.notificationAutomaticTemplateRepository.list(params);
    return {
      limit: params.limit,
      page: params.page,
      total: templates.total,
      list: templates.list
    };
  };
}
