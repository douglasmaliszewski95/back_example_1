import { Entity } from "../../../../core/entities/entity";
import { NotificationStatus } from "../../../../core/enums/notification-status-enum";
import { NotificationType } from "../../../../core/enums/notification-type-enum";

export interface NotificationProps {
  id?: number;
  title: string;
  content: string;
  startDate?: Date | null;
  endDate?: Date | null;
  tier: number[];
  status: NotificationStatus;
  type: NotificationType;
}

export class Notification extends Entity<NotificationProps> {
  get id(): number | undefined {
    return this.props.id;
  }
  set id(value: number) {
    this.props.id = value;
  }
  get tier(): number[] {
    return this.props.tier;
  }
  set tier(value: number[]) {
    this.props.tier = value;
  }
  get title(): string {
    return this.props.title;
  }
  set title(value: string) {
    this.props.title = value;
  }
  get content(): string {
    return this.props.content;
  }
  set content(value: string) {
    this.props.content = value;
  }
  get status(): NotificationStatus {
    return this.props.status;
  }
  set status(value: NotificationStatus) {
    this.props.status = value;
  }
  get startDate(): Date | null | undefined {
    return this.props.startDate;
  }
  set startDate(value: Date) {
    this.props.startDate = value;
  }
  get endDate(): Date | null | undefined {
    return this.props.endDate;
  }
  set endDate(value: Date) {
    this.props.endDate = value;
  }
  get type(): NotificationType {
    return this.props.type;
  }
  set type(value: NotificationType) {
    this.props.type = value;
  }

  static create(props: NotificationProps) {
    const notification = new Notification({
      ...props
    });

    return notification;
  }
}
