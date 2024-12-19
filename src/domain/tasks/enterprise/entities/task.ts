import { Entity } from "../../../../core/entities/entity";

export interface TaskProps {
  name: string;
  description: string;
  points: number;
  completedDate: Date;
  providerPlayerId: string;
  taskId?: string;
  seasonId: number;
  systemId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task extends Entity<TaskProps> {
  get name(): string {
    return this.props.name;
  }
  get description(): string {
    return this.props.description;
  }
  get points(): number {
    return this.props.points;
  }
  get completedDate(): Date {
    return this.props.completedDate;
  }
  get providerPlayerId(): string {
    return this.props.providerPlayerId;
  }
  get taskId(): string | undefined {
    return this.props.taskId;
  }
  get systemId(): string {
    return this.props.systemId;
  }
  get seasonId(): number {
    return this.props.seasonId;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  set createdAt(value: Date) {
    this.props.createdAt = value;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
  set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  static create(props: TaskProps) {
    const task = new Task({
      ...props
    });

    return task;
  }
}
