import { PlayerTotalPointsRepository } from "../repositories/player-total-points-repository";

interface AllTimeLeaderboardsRequestDTO {
  limit: number;
  page: number;
}

export class AllTimeLeaderboardsUseCase {

  constructor(private playerTotalPointsRepository: PlayerTotalPointsRepository) { }

  execute = async (data: AllTimeLeaderboardsRequestDTO) => {
    const leaderboards = await this.playerTotalPointsRepository.getAllTimeLeaderboards(data.limit, data.page);
    return leaderboards;
  }
}