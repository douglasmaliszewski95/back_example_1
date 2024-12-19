import { Entity } from "../../../../core/entities/entity";

export type SYSTEM_STATUS = "ACTIVE" | "PENDING" | "INACTIVE";

export interface SystemProps {
  id?: number;
  name: string;
  description: string;
  systemId: string;
  status?: SYSTEM_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}

export class System extends Entity<SystemProps> {
  get name(): string {
    return this.props.name;
  }
  get description(): string {
    return this.props.description;
  }
  get systemId(): string {
    return this.props.systemId;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
  get id(): number | undefined {
    return this.props.id;
  }

  get status(): SYSTEM_STATUS | undefined {
    return this.props.status;
  }

  static create(props: SystemProps) {
    const system = new System({
      ...props
    });

    return system;
  }
}
