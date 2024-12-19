import { PLAYER_STATUS } from "../../../../../core/enums/player-status-enum";
import { createInviteCodeLink } from "../../helpers/invite-code";
import { PlayersRepository } from "../../repositories/players-repository";
import { FindPlayerResponse } from "../../repositories/players-repository.types";

type ListPlayersFilters = {
  limit: number;
  page: number;
  id?: number;
  tier?: number[];
  username?: string;
  wallet?: string;
  seasonPointsStart?: number;
  seasonPointsEnd?: number;
  totalPointsStart?: number;
  totalPointsEnd?: number;
  startCreatedAt?: Date;
  endCreatedAt?: Date;
  status?: PLAYER_STATUS[];
  email?: string;
};

export type ListPlayersResponseDTO = {
  page: number;
  limit: number;
  total: number;
  totalOfPages: number;
  list: FindPlayerResponse[];
};

export class ListAllPlayersUseCase {
  constructor(private readonly playersRepository: PlayersRepository) {}

  async execute(filters: ListPlayersFilters): Promise<ListPlayersResponseDTO> {
    const totalPointsFilter = {
      start: filters.totalPointsStart,
      end: filters.totalPointsEnd
    };

    const seasonPointsFilter = {
      start: filters.seasonPointsStart,
      end: filters.seasonPointsEnd
    };

    const paginatedPlayers = await this.playersRepository.listAllPlayers({
      ...filters,
      totalPoints: totalPointsFilter,
      seasonPoints: seasonPointsFilter
    });

    return {
      page: filters.page,
      limit: filters.limit,
      total: paginatedPlayers.total,
      totalOfPages: paginatedPlayers.totalOfPages,
      list: paginatedPlayers.list.map(player => ({
        ...player,
        inviteCode: createInviteCodeLink(player.inviteCode)
      }))
    };
  }
}
