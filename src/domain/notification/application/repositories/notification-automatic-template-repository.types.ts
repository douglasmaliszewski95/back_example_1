import {
  AutomaticNotificationType,
  AutomaticNotificationTypeEnum
} from "../../../../core/enums/notification-automatic-enum";

export interface ListNotificationAutomaticTemplatesParams {
  page: number;
  limit: number;
}

export interface NotificationAutomaticTemplateResponse {
  id: number;
  type: AutomaticNotificationType;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  active: boolean;
}

export interface ListNotificationAutomaticTemplatesResponseDTO {
  total: number;
  totalOfPages: number;
  list: NotificationAutomaticTemplateResponse[];
}

export interface UpdateNotificationAutomaticTemplateData {
  title?: string;
  content?: string;
  active?: boolean;
  updatedBy: string;
}

export interface FindNotificationAutomaticTemplateByParams {
  type?: AutomaticNotificationTypeEnum | AutomaticNotificationType;
  active?: boolean;
}
