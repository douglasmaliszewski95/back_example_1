import { PlayerStatus } from "../../../../core/enums/player-status-enum";

interface ListAllPlayersFilters {
  page?: number;
  limit?: number;
  id?: number;
  username?: string;
  wallet?: string;
  tier?: number[];
  seasonPoints?: Partial<Points>;
  totalPoints?: Partial<Points>;
  status?: PlayerStatus[];
  startCreatedAt?: Date;
  endCreatedAt?: Date;
  email?: string;
}

interface SearchPlayersFilters {
  tier?: number[];
  seasonPoints?: Partial<Points>[];
  totalPoints?: Partial<Points>[];
  includeProviderPlayerIds?: string[];
}

interface FindPlayerResponse {
  providerPlayerId: string;
  username: string;
  wallet: string | null;
  galxeDiscordId: string | null;
  galxeTwitterId: string | null;
  galxeTelegramId: string | null;
  galxeEmail: string | null;
  galxeId: string | null;
  supabaseEmail: string | null;
  tier: number;
  seasonPoints: number;
  totalPoints: number;
  points: number;
  status: PlayerStatus;
  inviteCode: string | null;
  acceptedInvites: number;
  origin: string;
  reason: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

interface FindPlayerResponseDTO {
  total: number;
  totalOfPages: number;
  list: FindPlayerResponse[];
}

interface UpdatePlayerRequestDTO {
  wallet?: string;
  galxeDiscordId?: string;
  galxeTwitterId?: string;
  galxeTelegramId?: string;
  galxeEmail?: string;
  galxeId?: string;
  username?: string;
  status?: PlayerStatus;
  inviteCode?: string;
}

interface Points {
  start: number;
  end: number;
}

export {
  FindPlayerResponse,
  UpdatePlayerRequestDTO,
  Points,
  ListAllPlayersFilters,
  SearchPlayersFilters,
  FindPlayerResponseDTO
};
