import { Entity } from "../../../../core/entities/entity";
import { AdminStatus } from "../../../../core/enums/admin-status-enum";

export interface AdminProps {
  fullname: string;
  email: string;
  password?: string;
  status: AdminStatus;
  id?: string;
}

export class Admin extends Entity<AdminProps> {

  get fullname(): string { return this.props.fullname; }
  get email(): string { return this.props.email; }
  get id(): string | undefined { return this.props.id; }
  set id(value: string) { this.props.id = value; }
  get password(): string | undefined { return this.props.password; }
  get status(): AdminStatus { return this.props.status; }

  static create(props: AdminProps) {
    const admin = new Admin({
      ...props,
    })

    return admin;
  }
}