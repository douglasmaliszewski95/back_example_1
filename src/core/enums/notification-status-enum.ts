export enum NotificationStatusEnum {
  DRAFT = "DRAFT",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  ACTIVE = "ACTIVE"
}

export type NotificationStatus = `${NotificationStatusEnum}`;
