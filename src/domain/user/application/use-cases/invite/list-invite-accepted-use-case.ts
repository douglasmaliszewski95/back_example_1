import { HttpStatus } from "../../../../../core/errors/http-status";
import { HttpException } from "../../../../../core/errors/HttpException";
import { InvitedPlayersRepository } from "../../repositories/invited-players-repository";
import { InvitedPlayersDTO } from "../../repositories/invited-players-repository.types";
import { PlayersRepository } from "../../repositories/players-repository";

interface ListInvitedPlayersParamsDTO {
  page: number;
  limit: number;
}

interface ListInvitedPlayersResponseDTO {
  currentPage: number;
  limit: number;
  nrOfPages: number;
  total: number;
  items: InvitedPlayersDTO[];
}

export class ListInviteAcceptedUseCase {
  constructor(
    private playersRepository: PlayersRepository,
    private invitedPlayersRepository: InvitedPlayersRepository
  ) {}

  execute = async (
    providerPlayerId: string,
    params: ListInvitedPlayersParamsDTO
  ): Promise<ListInvitedPlayersResponseDTO> => {
    const player = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    if (!player) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "player not found");

    const invitedPlayers = await this.invitedPlayersRepository.list(providerPlayerId, params.limit, params.page);

    return {
      limit: params.limit,
      currentPage: params.page,
      total: invitedPlayers.total,
      nrOfPages: invitedPlayers.totalOfPages,
      items: invitedPlayers.list
    };
  };
}
