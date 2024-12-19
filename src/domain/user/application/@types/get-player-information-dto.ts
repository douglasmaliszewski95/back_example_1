interface GetPlayerInformationDTO extends GetBasicPlayerInformationDTO {
  totalPoints: {
    points: number;
    tier: number;
    progress: number;
    tierLastUpdatedTime: Date;
  };
  seasonPoints: {
    points: number;
    tier: number;
    seasonId: number;
    progress: number;
  };
}

interface GetBasicPlayerInformationDTO {
  providerPlayerId: string;
  supabaseEmail: string | null;
  username: string | null;
  wallet: string | null;
  galxeDiscordId: string | null;
  galxeTwitterId: string | null;
  galxeTelegramId: string | null;
  galxeEmail: string | null;
  galxeId: string | null;
  status: string | null;
  avatarUrl: string | null;
  inviteCode?: string | null;
  seasonPositition?: number;
  seasonTasksCompleted?: number;
  origin?: string;
  reason?: string | null;
}

export { GetPlayerInformationDTO, GetBasicPlayerInformationDTO };