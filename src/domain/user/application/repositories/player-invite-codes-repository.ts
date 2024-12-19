import { CreatePlayerInviteCodes, ListPlayerInviteCodeParams, ListPlayerInviteCodesResponse, PlayerInviteCodes } from "./player-invite-codes-repository.types";

export interface PlayerInviteCodesRepository {
  create(data: CreatePlayerInviteCodes): Promise<void>;
  findByInviteCode(inviteCode: string): Promise<PlayerInviteCodes | null>;
  list(providerPlayerId: string, params: ListPlayerInviteCodeParams): Promise<ListPlayerInviteCodesResponse>;
}