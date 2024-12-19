import {
  AutomaticNotificationType,
  AutomaticNotificationTypeEnum
} from "../../../core/enums/notification-automatic-enum";
import { NotificationAutomaticTemplateRepository } from "../../../domain/notification/application/repositories/notification-automatic-template-repository";
import {
  NotificationAutomaticTemplateResponse,
  ListNotificationAutomaticTemplatesParams,
  ListNotificationAutomaticTemplatesResponseDTO,
  UpdateNotificationAutomaticTemplateData,
  FindNotificationAutomaticTemplateByParams
} from "../../../domain/notification/application/repositories/notification-automatic-template-repository.types";
import { NotificationAutomaticTemplate } from "../../../domain/notification/enterprise/entities/notification-automatic-template";
import { PrismaNotificationAutomaticTemplateMapper } from "../mappers/prisma-notification-automatic-template-mapper";
import { prisma } from "../prisma";

export class PrismaNotificationAutomaticTemplateRepository implements NotificationAutomaticTemplateRepository {
  async create(data: NotificationAutomaticTemplate): Promise<NotificationAutomaticTemplateResponse> {
    const template = await prisma.notificationAutomaticTemplates.create({
      data: PrismaNotificationAutomaticTemplateMapper.toPrisma(data)
    });
    return PrismaNotificationAutomaticTemplateMapper.toNotificationAutomaticTemplateResponse(template);
  }

  async findById(id: number): Promise<NotificationAutomaticTemplateResponse | null> {
    const template = await prisma.notificationAutomaticTemplates.findUnique({
      where: { id }
    });
    return template
      ? PrismaNotificationAutomaticTemplateMapper.toNotificationAutomaticTemplateResponse(template)
      : null;
  }

  async update(
    id: number,
    data: UpdateNotificationAutomaticTemplateData
  ): Promise<NotificationAutomaticTemplateResponse> {
    const updatedTemplate = await prisma.notificationAutomaticTemplates.update({
      where: { id },
      data
    });
    return PrismaNotificationAutomaticTemplateMapper.toNotificationAutomaticTemplateResponse(updatedTemplate);
  }

  async count(): Promise<number> {
    return await prisma.notificationAutomaticTemplates.count();
  }

  async list(params: ListNotificationAutomaticTemplatesParams): Promise<ListNotificationAutomaticTemplatesResponseDTO> {
    const [templates, total] = await Promise.all([
      prisma.notificationAutomaticTemplates.findMany({
        take: params.limit,
        skip: (params.page - 1) * params.limit,
        orderBy: {
          updatedAt: "desc"
        }
      }),
      this.count()
    ]);
    return {
      total: total,
      totalOfPages: Math.ceil(total / params.limit),
      list: templates.map(PrismaNotificationAutomaticTemplateMapper.toNotificationAutomaticTemplateResponse)
    };
  }

  async findBy(params: FindNotificationAutomaticTemplateByParams): Promise<NotificationAutomaticTemplate | null> {
    const template = await prisma.notificationAutomaticTemplates.findFirst({
      where: params
    });

    return template ? PrismaNotificationAutomaticTemplateMapper.toEntity(template) : null;
  }
}
