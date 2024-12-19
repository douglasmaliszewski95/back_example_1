interface UpdatePlayerSeasonPointsRequest {
  newTier?: number;
  points?: number;
  progress?: number;
  lastTier?: number;
}

interface LeaderboardsDTO {
  seasonId: number;
  points: number;
  tier: number;
  seasonTier: number;
  player: {
    username: string | null;
    avatarUrl: string | null;
  };
}

interface PaginatedSeasonLeaderboards {
  total: number;
  limit: number;
  currentPage: number;
  nrOfPages: number;
  items: LeaderboardsDTO[]
}

export { UpdatePlayerSeasonPointsRequest, LeaderboardsDTO, PaginatedSeasonLeaderboards };