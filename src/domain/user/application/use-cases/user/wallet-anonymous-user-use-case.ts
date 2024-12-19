import { PLAYER_STATUS } from "@prisma/client";
import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { Player } from "../../../enterprise/entities/player";
import { GetBasicPlayerInformationDTO } from "../../@types/get-player-information-dto";
import { AuthPlayerProvider, GetPlayerResponseDTO } from "../../auth-provider/auth-player-provider";
import { generatePlayerInformationResponse } from "../../helpers/generators";
import { PlayersRepository } from "../../repositories/players-repository";

export class WalletAnonymousUserUseCase {
  constructor(private authProvider: AuthPlayerProvider, private playersRepository: PlayersRepository) {}

  execute = async (wallet: string, accessToken: string) => {
    // if (!wallet) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "You have to send a wallet");
    const player = await this.authProvider.getPlayer(accessToken);
    if (!player) throw new HttpException(HttpStatus.UNAUTHORIZED, "Player not found");
    const playerExists = await this.playersRepository.findPlayerByProviderId(player.providerPlayerId);
    if (playerExists === null) {
      const playerInserted = await this.insertPlayer(wallet, player);

      return playerInserted;
    } else {
      const playerUpdated = await this.updatePlayer(wallet, player);

      return playerUpdated;
    }
  };

  private insertPlayer = async (
    wallet: string,
    player: GetPlayerResponseDTO
  ): Promise<GetBasicPlayerInformationDTO> => {
    const data = {
      providerPlayerId: player.providerPlayerId,
      status: PLAYER_STATUS.PENDING_ACCOUNT,
      wallet: wallet
    };

    const updatedPlayer = await this.playersRepository.create(Player.create({ ...data, email: "" }));

    return generatePlayerInformationResponse(updatedPlayer);
  };

  private updatePlayer = async (
    wallet: string,
    player: GetPlayerResponseDTO
  ): Promise<GetBasicPlayerInformationDTO> => {
    const data = {
      providerPlayerId: player.providerPlayerId,
      status: PLAYER_STATUS.PENDING_ACCOUNT,
      wallet: wallet
    };

    const updatedPlayer = await this.playersRepository.updatePlayer(player.providerPlayerId, data);

    return generatePlayerInformationResponse(updatedPlayer);
  };
}
