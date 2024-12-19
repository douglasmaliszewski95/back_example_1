import { HttpStatus } from "../../../../../core/errors/http-status";
import { HttpException } from "../../../../../core/errors/HttpException";
import { PlayerInviteCodesRepository } from "../../repositories/player-invite-codes-repository";
import { PlayerInviteCodes } from "../../repositories/player-invite-codes-repository.types";
import { PlayersRepository } from "../../repositories/players-repository";

interface ListPlayerInviteCodesParamsDTO {
  page: number;
  limit: number;
}

interface ListPlayerInviteCodesResponseDTO {
  page: number;
  limit: number;
  totalOfPages: number;
  total: number;
  list: PlayerInviteCodes[];
}

export class ListPlayerInviteCodesUseCase {
  constructor(private playersRepository: PlayersRepository, private playerInviteCodesRepository: PlayerInviteCodesRepository) { }

  execute = async (providerPlayerId: string, params: ListPlayerInviteCodesParamsDTO): Promise<ListPlayerInviteCodesResponseDTO> => {
    const player = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    if (!player) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "player not found");

    const playerInviteCodes = await this.playerInviteCodesRepository.list(providerPlayerId, {
      limit: params.limit,
      page: params.page
    });

    return {
      limit: params.limit,
      page: params.page,
      total: playerInviteCodes.total,
      totalOfPages: playerInviteCodes.totalOfPages,
      list: playerInviteCodes.list
    }
  }
}