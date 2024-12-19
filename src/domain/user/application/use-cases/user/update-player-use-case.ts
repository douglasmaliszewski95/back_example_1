import { PLAYER_STATUS } from "../../../../../core/enums/player-status-enum";
import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { Player } from "../../../enterprise/entities/player";
import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";
import { PlayersRepository } from "../../repositories/players-repository";
import { FindPlayerResponse } from "../../repositories/players-repository.types";

interface UpdatePlayerRequestDTO {
  wallet?: string;
  galxeDiscordId?: string;
  galxeTwitterId?: string;
  galxeEmail?: string;
  galxeId?: string;
  username?: string;
  inviteCode?: string;
}

interface UpdatePlayerResponseDTO {
  player: Player;
}

export class UpdatePlayerUseCase {
  constructor(private playersRepository: PlayersRepository, private authProvider: AuthPlayerProvider) { }

  execute = async (accessToken: string, data: UpdatePlayerRequestDTO): Promise<UpdatePlayerResponseDTO> => {
    if (!accessToken) throw new HttpException(HttpStatus.UNAUTHORIZED, "unauthorized");
    const providerPlayerId = await this.getPlayerProviderInfomation(accessToken);
    if (data.inviteCode) {
      const inviteCodeExists = await this.playersRepository.findByInviteCode(data.inviteCode);
      if (inviteCodeExists) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "status code already used");
    }
    if (data.username) {
      const usernameExists = await this.playersRepository.findByUsername(data.username);
      if (usernameExists) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "username already used");
    }

    const player = await this.getPlayerRepositoryInformation(providerPlayerId);
    if (player.status === PLAYER_STATUS.PENDING_ACCOUNT && !data.wallet) throw new HttpException(HttpStatus.BAD_REQUEST, "Cannot continue without connecting a wallet");
    let status = player.status;
    if (player.status === PLAYER_STATUS.PENDING_ACCOUNT && data.username) status = PLAYER_STATUS.ACTIVE;
    const updatedPlayer = await this.playersRepository.updatePlayer(providerPlayerId, {
      ...data,
      status,
    });
    await this.updateInviteCode(providerPlayerId, updatedPlayer.username, data.inviteCode, updatedPlayer.inviteCode);

    return {
      player: updatedPlayer
    };
  }

  private getPlayerProviderInfomation = async (accessToken: string): Promise<string> => {
    const token = accessToken.split(" ")[1];
    const authProviderPlayerExists = await this.authProvider.getPlayer(token);
    if (!authProviderPlayerExists) throw new HttpException(HttpStatus.NOT_FOUND, "user does not exists");
    return authProviderPlayerExists.providerPlayerId;
  }

  private getPlayerRepositoryInformation = async (providerPlayerId: string): Promise<FindPlayerResponse> => {
    const playerExists = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    if (!playerExists) throw new HttpException(HttpStatus.NOT_FOUND, "user does not exists");
    return playerExists;
  }

  private updateInviteCode = async (providerPlayerId: string, username?: string, updatedInviteCode?: string, currentInviteCode?: string) => {
    let updateInviteCode = null;
    if (username) updateInviteCode = username;
    if (currentInviteCode) updateInviteCode = currentInviteCode;
    if (updatedInviteCode) updateInviteCode = updatedInviteCode;
    if (updateInviteCode) await this.playersRepository.updatePlayer(providerPlayerId, {
      inviteCode: updateInviteCode
    });
  }
}