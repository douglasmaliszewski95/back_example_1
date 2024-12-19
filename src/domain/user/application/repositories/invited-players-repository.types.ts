interface InvitedPlayersCreateData {
  invitedProviderPlayerId: string;
  invitingProviderPlayerId: string;
  inviteCode: string;
}

interface InvitedPlayersList {
  list: {
    id: number;
    invitedProviderPlayerId: string;
    invitingProviderPlayerId: string;
    invitedPlayer: {
      username: string | null;
    };
    inviteCode: string;
    createdAt: Date;
  }[];
  total: number;
  totalOfPages: number;
}

interface InvitedPlayersDTO {
  id: number;
  invitedProviderPlayerId: string;
  invitingProviderPlayerId: string;
  inviteCode: string;
  createdAt: Date;
}

export { InvitedPlayersCreateData, InvitedPlayersList, InvitedPlayersDTO };
