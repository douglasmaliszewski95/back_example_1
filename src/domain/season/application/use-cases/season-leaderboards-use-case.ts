import { PlayerSeasonPointsRepository } from "../repositories/player-season-points-repository";

interface SeasonLeaderboardsRequestDTO {
  limit: number;
  page: number;
}

export class SeasonLeaderboardsUseCase {

  constructor(private playerSeasonPointsRepository: PlayerSeasonPointsRepository) { }

  execute = async (data: SeasonLeaderboardsRequestDTO) => {
    const seasonLeaderboards = await this.playerSeasonPointsRepository.getSeasonLeaderboards(data.limit, data.page);
    return seasonLeaderboards;
  }
}