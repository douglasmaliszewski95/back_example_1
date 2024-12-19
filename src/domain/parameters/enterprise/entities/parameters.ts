import { Entity } from "../../../../core/entities/entity";

export interface ParametersProps {
  id?: number;
  userId: string;
  galxeId?: string;
  termsAccepted: boolean;
  refreshToken: string;
  refreshTokenGalxe: string;
  createdAt?: Date;
  inviteCode?: string;
}

export class Parameters extends Entity<ParametersProps> {
  get id(): number | undefined {
    return this.props.id;
  }
  set id(value: number) {
    this.props.id = value;
  }
  get userId(): string {
    return this.props.userId;
  }
  set userId(value: string) {
    this.props.userId = value;
  }
  get galxeId(): string | undefined {
    return this.props.galxeId;
  }
  set galxeId(value: string) {
    this.props.galxeId = value;
  }
  get termsAccepted(): boolean {
    return this.props.termsAccepted;
  }
  set termsAccepted(value: boolean) {
    this.props.termsAccepted = value;
  }
  get refreshToken(): string {
    return this.props.refreshToken;
  }
  set refreshToken(value: string) {
    this.props.refreshToken = value;
  }
  get refreshTokenGalxe(): string {
    return this.props.refreshTokenGalxe;
  }
  set refreshTokenGalxe(value: string) {
    this.props.refreshTokenGalxe = value;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  set createdAt(value: Date) {
    this.props.createdAt = value;
  }
  get inviteCode(): string | undefined {
    return this.props.inviteCode;
  }
  set inviteCode(value: string) {
    this.props.inviteCode = value;
  }

  static create(props: ParametersProps) {
    const parameter = new Parameters({
      ...props
    });

    return parameter;
  }
}
