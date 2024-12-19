import { Entity } from "../../../../core/entities/entity";
import { AutomaticNotificationType } from "../../../../core/enums/notification-automatic-enum";

export interface NotificationAutomaticTemplateProps {
  id?: number;
  type: AutomaticNotificationType;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  active: boolean;
}

export class NotificationAutomaticTemplate extends Entity<NotificationAutomaticTemplateProps> {
  get id(): number | undefined {
    return this.props.id;
  }
  set id(value: number) {
    this.props.id = value;
  }
  get type(): AutomaticNotificationType {
    return this.props.type;
  }
  set type(value: AutomaticNotificationType) {
    this.props.type = value;
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
  get createdAt(): Date {
    return this.props.createdAt;
  }
  set createdAt(value: Date) {
    this.props.createdAt = value;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }
  get updatedBy(): string | null {
    return this.props.updatedBy;
  }
  set updatedBy(value: string | null) {
    this.props.updatedBy = value;
  }
  get active(): boolean {
    return this.props.active;
  }
  set active(value: boolean) {
    this.props.active = value;
  }

  static create(props: NotificationAutomaticTemplateProps) {
    const notificationAutomaticTemplate = new NotificationAutomaticTemplate({
      ...props
    });

    return notificationAutomaticTemplate;
  }
}
