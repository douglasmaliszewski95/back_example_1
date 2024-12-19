import { Entity } from "../../../../core/entities/entity";

export interface PlayerSeasonPointsProps {
  id?: number;
  providerPlayerId: string;
  seasonId: number;
  points: number;
  tier: number;
  lastTier: number;
  progress: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PlayerSeasonPoints extends Entity<PlayerSeasonPointsProps> {
  get id(): number | undefined { return this.props.id; }
  set id(value: number) { this.props.id = value; }
  get providerPlayerId(): string { return this.props.providerPlayerId }
  get seasonId(): number { return this.props.seasonId; }
  get points(): number { return this.props.points; }
  set points(value: number) { this.props.points = value; }
  get tier(): number { return this.props.tier; }
  set tier(value: number) { this.props.tier = value; }
  get lastTier(): number { return this.props.lastTier; }
  set lastTier(value: number) { this.props.lastTier = value; }
  get progress(): number { return this.props.progress; }
  set progress(value: number) { this.props.progress = value; }
  get createdAt(): Date | undefined { return this.props.createdAt; }
  set createdAt(value: Date) { this.props.createdAt = value; }
  get updatedAt(): Date | undefined { return this.props.updatedAt; }
  set updatedAt(value: Date) { this.props.updatedAt = value; }

  static create(props: PlayerSeasonPointsProps) {
    const playerPoints = new PlayerSeasonPoints({
      ...props
    });

    return playerPoints;
  }
}