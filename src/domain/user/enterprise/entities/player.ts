import { Entity } from "../../../../core/entities/entity";
import { PlayerStatus } from "../../../../core/enums/player-status-enum";

export interface PlayerProps {
  id?: number;
  avatarUrl?: string;
  username?: string;
  email: string;
  password?: string;
  wallet?: string;
  galxeDiscordId?: string;
  galxeTwitterId?: string;
  galxeTelegramId?: string;
  galxeEmail?: string;
  galxeId?: string;
  supabaseEmail?: string;
  providerPlayerId?: string;
  tier?: number;
  points?: number;
  origin?: string;
  inviteCode?: string;
  reason?: string;
  status: PlayerStatus;
}

export class Player extends Entity<PlayerProps> {
  get id(): number | undefined {
    return this.props.id;
  }
  set id(value: number) {
    this.props.id = value;
  }
  get username(): string | undefined {
    return this.props.username;
  }
  set username(value: string) {
    this.props.username = value;
  }
  get email(): string {
    return this.props.email;
  }
  get password(): string | undefined {
    return this.props.password;
  }
  get wallet(): string | undefined {
    return this.props.wallet;
  }
  set wallet(value: string) {
    this.props.wallet = value;
  }
  get galxeDiscordId(): string | undefined {
    return this.props.galxeDiscordId;
  }
  set galxeDiscordId(value: string) {
    this.props.wallet = value;
  }
  get galxeTwitterId(): string | undefined {
    return this.props.galxeTwitterId;
  }
  set galxeTwitterId(value: string) {
    this.props.galxeTwitterId = value;
  }
  get galxeTelegramId(): string | undefined {
    return this.props.galxeTelegramId;
  }
  set galxeTelegramId(value: string) {
    this.props.galxeTelegramId = value;
  }
  get galxeEmail(): string | undefined {
    return this.props.galxeEmail;
  }
  get supabaseEmail(): string | undefined {
    return this.props.supabaseEmail;
  }
  set galxeEmail(value: string) {
    this.props.galxeEmail = value;
  }
  get providerPlayerId(): string | undefined {
    return this.props.providerPlayerId;
  }
  set providerPlayerId(value: string) {
    this.props.providerPlayerId = value;
  }
  get tier(): number | undefined {
    return this.props.tier;
  }
  get points(): number | undefined {
    return this.props.points;
  }
  get status(): PlayerStatus {
    return this.props.status;
  }
  get galxeId(): string | undefined {
    return this.props.galxeId;
  }
  get origin(): string | undefined {
    return this.props.origin;
  }
  set galxeId(value: string) {
    this.props.galxeId = value;
  }
  get avatarUrl(): string | undefined {
    return this.props.avatarUrl;
  }
  set avatarUrl(value: string) {
    this.props.avatarUrl = value;
  }
  get inviteCode(): string | undefined {
    return this.props.inviteCode;
  }
  set inviteCode(value: string) {
    this.props.inviteCode = value;
  }
  get reason(): string | undefined {
    return this.props.reason;
  }
  set reason(value: string) {
    this.props.reason = value;
  }

  static create(props: PlayerProps) {
    const user = new Player({
      points: 0,
      ...props
    });

    return user;
  }
}
