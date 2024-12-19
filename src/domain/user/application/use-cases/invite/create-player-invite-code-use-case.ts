import { HttpStatus } from "../../../../../core/errors/http-status";
import { HttpException } from "../../../../../core/errors/HttpException";
import { PlayerInviteCodesRepository } from "../../repositories/player-invite-codes-repository";
import { PlayersRepository } from "../../repositories/players-repository";

interface CreatePlayerInviteCodeRequestDTO {
  providerPlayerId: string;
  expiresIn: Date;
  inviteCode: string;
}

export class CreatePlayerInviteCodeUseCase {

  constructor(private playersRepository: PlayersRepository, private playerInviteCodesRepository: PlayerInviteCodesRepository) { }

  execute = async (data: CreatePlayerInviteCodeRequestDTO): Promise<void> => {
    const player = await this.playersRepository.findPlayerByProviderId(data.providerPlayerId);
    if (!player) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "player not found");
    const inviteCodeAlreadyRegistered = await this.playerInviteCodesRepository.findByInviteCode(data.inviteCode);
    if (inviteCodeAlreadyRegistered) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invite code unavailable");
    await this.playerInviteCodesRepository.create(data);
  }
}