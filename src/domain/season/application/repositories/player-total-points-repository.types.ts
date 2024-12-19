interface UpdatePlayerTotalPoints {
  points?: number;
  tier?: number;
  tierLastUpdatedTime?: Date;
  progress?: number;
}

interface AllTimeLeaderboardsDTO {
  points: number;
  tier: number;
  player: {
    username: string | null;
    avatarUrl?: string | null;
  };
}

interface PaginatedTotalPointsLeaderboards {
  total: number;
  currentPage: number;
  limit: number;
  nrOfPages: number;
  items: AllTimeLeaderboardsDTO[]
}

export { UpdatePlayerTotalPoints, AllTimeLeaderboardsDTO, PaginatedTotalPointsLeaderboards };