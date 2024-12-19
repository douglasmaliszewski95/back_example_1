import { NotificationAutomaticTemplate } from "../../enterprise/entities/notification-automatic-template";
import {
  NotificationAutomaticTemplateResponse,
  ListNotificationAutomaticTemplatesParams,
  ListNotificationAutomaticTemplatesResponseDTO,
  UpdateNotificationAutomaticTemplateData,
  FindNotificationAutomaticTemplateByParams
} from "./notification-automatic-template-repository.types";

export interface NotificationAutomaticTemplateRepository {
  findById(id: number): Promise<NotificationAutomaticTemplateResponse | null>;
  findBy(params: FindNotificationAutomaticTemplateByParams): Promise<NotificationAutomaticTemplate | null>;
  list(params: ListNotificationAutomaticTemplatesParams): Promise<ListNotificationAutomaticTemplatesResponseDTO>;
  count(): Promise<number>;
  update(id: number, data: UpdateNotificationAutomaticTemplateData): Promise<NotificationAutomaticTemplateResponse>;
  create(data: NotificationAutomaticTemplate): Promise<NotificationAutomaticTemplateResponse>;
}
