import { Entity } from "../../../../core/entities/entity";

export interface SeasonProps {
  id?: number;
  name: string;
  description: string;
  active: boolean;
  startAt: Date;
  endAt: Date;
}

export class Season extends Entity<SeasonProps> {

  get id(): number | undefined { return this.props.id; }
  set id(value: number) { this.props.id = value; }
  get name(): string { return this.props.name; }
  set name(value: string) { this.props.name = value; }
  get description(): string { return this.props.description; }
  set description(value: string) { this.props.description = value; }
  get active(): boolean { return this.props.active; }
  set active(value: boolean) { this.props.active = value; }
  get startAt(): Date { return this.props.startAt; }
  set startAt(value: Date) { this.props.startAt = value; }
  get endAt(): Date { return this.props.endAt; }
  set endAt(value: Date) { this.props.endAt = value; }

  static create(props: SeasonProps) {
    const season = new Season({
      ...props
    });

    return season;
  }
}