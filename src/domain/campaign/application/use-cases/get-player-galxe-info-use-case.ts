import { PLAYER_STATUS } from "../../../../core/enums/player-status-enum";
import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { AuthPlayerProvider } from "../../../user/application/auth-provider/auth-player-provider";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { Player } from "../../../user/enterprise/entities/player";
import { CampaignGateway } from "../gateway/campaign-gateway";

interface GetPlayerGalxeInfoResponseDTO {
  player: Player;
}

export class GetPlayerGalxeInfoUseCase {

  constructor(
    private campaignGateway: CampaignGateway,
    private playersRepository: PlayersRepository,
    private authPlayerProvider: AuthPlayerProvider
  ) { }

  execute = async (accessToken: string, code: string): Promise<GetPlayerGalxeInfoResponseDTO> => {
    const providerPlayer = await this.authPlayerProvider.getPlayer(accessToken);
    if (!providerPlayer) throw new HttpException(HttpStatus.UNAUTHORIZED, "Player not found");
    const providerPlayerId = providerPlayer.providerPlayerId;
    const galxeInfo = await this.campaignGateway.getGalxeUserInformation(code);
    if (!galxeInfo) throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "cannot retrieve galxe information");
    const galxeIdAlreadyRegistered = await this.playersRepository.findByGalxeId(galxeInfo.GalxeID);
    if (galxeIdAlreadyRegistered) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Galxe account already registered");
    const updatedPlayer = await this.playersRepository.updatePlayer(providerPlayerId, {
      galxeDiscordId: galxeInfo.DiscordUserID,
      galxeEmail: galxeInfo.Email,
      galxeId: galxeInfo.GalxeID,
      galxeTwitterId: galxeInfo.TwitterUserID,
      galxeTelegramId: galxeInfo.TelegramUserID,
      status: PLAYER_STATUS.ACTIVE
    });

    return {
      player: updatedPlayer
    }
  }
}