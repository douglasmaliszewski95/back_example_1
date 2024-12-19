import { NotificationAutomaticTemplateRepository } from "../../src/domain/notification/application/repositories/notification-automatic-template-repository";
import { NotificationAutomaticTemplate } from "../../src/domain/notification/enterprise/entities/notification-automatic-template";
import {
  NotificationAutomaticTemplateResponse,
  FindNotificationAutomaticTemplateByParams,
  ListNotificationAutomaticTemplatesParams,
  ListNotificationAutomaticTemplatesResponseDTO,
  UpdateNotificationAutomaticTemplateData
} from "../../src/domain/notification/application/repositories/notification-automatic-template-repository.types";

export class NotificationAutomaticTemplateRepositoryInMemory implements NotificationAutomaticTemplateRepository {
  notificationTemplates: NotificationAutomaticTemplate[] = [];

  async create(data: NotificationAutomaticTemplate): Promise<NotificationAutomaticTemplateResponse> {
    this.notificationTemplates.push(data);
    return {
      id: data.id!,
      active: data.active,
      type: data.type,
      title: data.title,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      updatedBy: data.updatedBy
    };
  }

  async findById(id: number): Promise<NotificationAutomaticTemplateResponse | null> {
    const notificationTemplate = this.notificationTemplates.find(notification => notification.id === id);
    return notificationTemplate
      ? {
          id: notificationTemplate.id!,
          active: notificationTemplate.active,
          type: notificationTemplate.type,
          title: notificationTemplate.title,
          content: notificationTemplate.content,
          createdAt: notificationTemplate.createdAt,
          updatedAt: notificationTemplate.updatedAt,
          updatedBy: notificationTemplate.updatedBy
        }
      : null;
  }

  async findBy(params: FindNotificationAutomaticTemplateByParams): Promise<NotificationAutomaticTemplate | null> {
    let filtered = this.notificationTemplates;
    if (params.active) {
      filtered = filtered.filter(notification => notification.active === params.active);
    }
    if (params.type) {
      filtered = filtered.filter(notification => notification.type === params.type);
    }
    return filtered.length > 0 ? filtered[0] : null;
  }

  async list({
    page,
    limit
  }: ListNotificationAutomaticTemplatesParams): Promise<ListNotificationAutomaticTemplatesResponseDTO> {
    const totalRecords = this.notificationTemplates.length;
    const notificationsList = this.notificationTemplates.slice((page - 1) * limit, page * limit);

    return {
      total: totalRecords,
      totalOfPages: Math.ceil(totalRecords / limit),
      list: notificationsList.map(notification => ({
        id: notification.id!,
        active: notification.active,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
        updatedBy: notification.updatedBy
      }))
    };
  }

  async count(): Promise<number> {
    return this.notificationTemplates.length;
  }

  async update(
    id: number,
    data: UpdateNotificationAutomaticTemplateData
  ): Promise<NotificationAutomaticTemplateResponse> {
    const notificationTemplateIndex = this.notificationTemplates.findIndex(item => item.id === id);
    const notificationTemplate = this.notificationTemplates[notificationTemplateIndex];
    if (data.active) notificationTemplate.active = data.active;
    if (data.content) notificationTemplate.content = data.content;
    if (data.title) notificationTemplate.title = data.title;
    if (data.updatedBy) notificationTemplate.updatedBy = data.updatedBy;
    notificationTemplate.updatedAt = new Date();
    notificationTemplate.updatedBy = data.updatedBy;
    return {
      id: notificationTemplate.id!,
      active: notificationTemplate.active,
      type: notificationTemplate.type,
      title: notificationTemplate.title,
      content: notificationTemplate.content,
      createdAt: notificationTemplate.createdAt,
      updatedAt: notificationTemplate.updatedAt,
      updatedBy: notificationTemplate.updatedBy
    };
  }
}
