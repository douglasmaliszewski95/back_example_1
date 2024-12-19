import { Entity } from "../../../../core/entities/entity";

export interface NotificationRegistryProps {
  id?: number;
  recipientId: string;
  origin: string;
  notificationId: number;
  isRead?: boolean;
  isDeleted?: boolean;
  readAt?: Date | null;
}

export class NotificationRegistry extends Entity<NotificationRegistryProps> {
  get id(): number | undefined {
    return this.props.id;
  }
  set id(value: number) {
    this.props.id = value;
  }
  get recipientId(): string {
    return this.props.recipientId;
  }
  get origin(): string {
    return this.props.origin;
  }
  get notificationId(): number {
    return this.props.notificationId;
  }
  get isRead(): boolean | undefined {
    return this.props.isRead;
  }
  set isRead(value: boolean) {
    this.props.isRead = value;
  }
  get isDeleted(): boolean | undefined {
    return this.props.isDeleted;
  }
  set isDeleted(value: boolean) {
    this.props.isDeleted = value;
  }
  get readAt(): Date | null | undefined {
    return this.props.readAt;
  }
  set readAt(value: Date) {
    this.props.readAt = value;
  }

  static create(props: NotificationRegistryProps) {
    const notificationRegistry = new NotificationRegistry({
      ...props
    });

    return notificationRegistry;
  }
}
