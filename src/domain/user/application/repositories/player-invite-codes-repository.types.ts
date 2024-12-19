interface CreatePlayerInviteCodes {
  inviteCode: string;
  expiresIn: Date;
  providerPlayerId: string;
}

interface PlayerInviteCodes {
  id: number;
  inviteCode: string;
  expiresIn: Date;
  providerPlayerId: string;
  acceptedQuantity: number;
}

interface ListPlayerInviteCodeParams {
  page: number;
  limit: number;
}

interface ListPlayerInviteCodesResponse {
  total: number;
  totalOfPages: number;
  list: PlayerInviteCodes[];
}

export { CreatePlayerInviteCodes, PlayerInviteCodes, ListPlayerInviteCodeParams, ListPlayerInviteCodesResponse };