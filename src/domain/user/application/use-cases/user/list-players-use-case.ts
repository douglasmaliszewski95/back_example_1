import { SystemStatus } from "../../../../../core/enums/system-status-enum";
import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { SystemRepository } from "../../../../system/application/repositories/system-repository";
import { filterAndPaginatePlayers, generateListUsersResponse } from "../../helpers/generators";
import { PlayersRepository } from "../../repositories/players-repository";

export interface ListPlayersRequestDTO {
  page: number;
  limit: number;
  username?: string;
  discordId?: string;
  twitterId?: string;
  telegramId?: string;
  email?: string;
}

export interface PlayerslistDTO {
  providerPlayerId: string;
  email: string | null;
  username: string | null;
  wallet: string | null;
  galxe: {
    discordId: string | null;
    twitterId: string | null;
    telegramId: string | null;
    email: string | null;
    id: string | null;
  };
  seasonPoints: {
    points: number;
    tier: number;
  }
  totalPoints: {
    points: number;
    tier: number;
  };
  inviteCode: string;
}

interface ListPlayersResponseDTO {
  page: number;
  limit: number;
  total: number;
  totalOfPages: number;
  list: PlayerslistDTO[];
}

export class ListPlayersUseCase {
  constructor(
    private playersRepository: PlayersRepository,
    private systemsRepository: SystemRepository
  ) { }

  execute = async (system: string, params: ListPlayersRequestDTO): Promise<ListPlayersResponseDTO> => {
    const systemExists = await this.systemsRepository.findBySystemId(system);
    if (!systemExists) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid system");
    const systemActive = systemExists.status === SystemStatus.ACTIVE;
    if (!systemActive) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid system");

    const repositoryPlayers = await this.playersRepository.fetchAllPlayers();
    const allPlayers = generateListUsersResponse(repositoryPlayers);
    const { list, total, totalOfPages } = filterAndPaginatePlayers(allPlayers, params);
    return {
      page: params.page,
      limit: params.limit,
      total: total,
      totalOfPages: totalOfPages,
      list: list
    };
  };
}
