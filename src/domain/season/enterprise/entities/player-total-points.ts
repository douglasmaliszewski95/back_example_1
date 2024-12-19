import { Entity } from "../../../../core/entities/entity";

export interface PlayerTotalPointsProps {
  id?: number;
  providerPlayerId: string;
  points: number;
  tier: number;
  tierLastUpdatedTime: Date;
  progress: number;
}

export class PlayerTotalPoints extends Entity<PlayerTotalPointsProps> {
  get id(): number | undefined { return this.props.id; }
  set id(value: number) { this.props.id = value }
  get providerPlayerId(): string { return this.props.providerPlayerId }
  get points(): number { return this.props.points; }
  set points(value: number) { this.props.points = value }
  get tier(): number { return this.props.tier; }
  set tier(value: number) { this.props.tier = value; }
  get tierLastUpdatedTime(): Date { return this.props.tierLastUpdatedTime; }
  set tierLastUpdatedTime(value: Date) { this.props.tierLastUpdatedTime = value; }
  get progress(): number { return this.props.progress; }
  set progress(value: number) { this.props.progress = value; }

  static create(props: PlayerTotalPointsProps) {
    const playerPoints = new PlayerTotalPoints({
      ...props
    });

    return playerPoints;
  }
}