import { Entity } from "../../../../core/entities/entity";

export interface AnnouncementProps {
  id?: number;
  tier: number[];
  title: string;
  message: string;
  startDate: Date;
  endDate?: Date;
  bannerUrl?: string;
  bannerExtension?: string;
}

export class Announcement extends Entity<AnnouncementProps> {
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

  get message(): string {
    return this.props.message;
  }
  set message(value: string) {
    this.props.message = value;
  }

  get title(): string {
    return this.props.title;
  }
  set title(value: string) {
    this.props.title = value;
  }

  get startDate(): Date {
    return this.props.startDate;
  }
  set startDate(value: Date) {
    this.props.startDate = value;
  }

  get endDate(): Date | undefined {
    return this.props.endDate;
  }
  set endDate(value: Date) {
    this.props.endDate = value;
  }

  get bannerUrl(): string | undefined {
    return this.props.bannerUrl;
  }
  set bannerUrl(value: string) {
    this.props.bannerUrl = value;
  }

  get bannerExtension(): string | undefined {
    return this.props.bannerExtension;
  }
  set bannerExtension(value: string) {
    this.props.bannerExtension = value;
  }

  static create(props: AnnouncementProps) {
    const announcement = new Announcement({
      ...props
    });

    return announcement;
  }
}
