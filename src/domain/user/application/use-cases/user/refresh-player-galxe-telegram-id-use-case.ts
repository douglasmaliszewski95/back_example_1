import { HttpStatus } from "../../../../../core/errors/http-status";
import { HttpException } from "../../../../../core/errors/HttpException";
import { CampaignGateway } from "../../../../campaign/application/gateway/campaign-gateway";
import { GetBasicPlayerInformationDTO } from "../../@types/get-player-information-dto";
import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";
import { generatePlayerInformationResponse } from "../../helpers/generators";
import { PlayersRepository } from "../../repositories/players-repository";

export class RefreshPlayerGalxeTelegramIdUseCase {
  constructor(
    private campaignGateway: CampaignGateway,
    private playersRepository: PlayersRepository,
    private authPlayerProvider: AuthPlayerProvider
  ) { }

  public execute = async (accessToken: string): Promise<GetBasicPlayerInformationDTO> => {
    const { galxeId, providerPlayerId } = await this.getPlayerGalxeId(accessToken);
    const telegramId = await this.fetchPlayerTelegramId(galxeId);
    const updatedPlayer = await this.updatePlayerTelegramId(telegramId, providerPlayerId);
    return updatedPlayer;
  }

  private getPlayerGalxeId = async (accessToken: string): Promise<{ galxeId: string, providerPlayerId: string }> => {
    const providerPlayer = await this.authPlayerProvider.getPlayer(accessToken);
    if (!providerPlayer) throw new HttpException(HttpStatus.UNAUTHORIZED, "Player not found");
    const providerPlayerId = providerPlayer.providerPlayerId;
    const player = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    if (!player) throw new HttpException(HttpStatus.NOT_FOUND, "Player not found");
    if (!player.galxeId) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Galxe Id not linked yet");
    return {
      galxeId: player.galxeId,
      providerPlayerId
    };
  }

  private fetchPlayerTelegramId = async (playerGalxeId: string): Promise<string> => {
    const galxeDetailedInfo = await this.campaignGateway.getGalxeUserDetailedInformation(playerGalxeId);
    if (!galxeDetailedInfo.telegramUserID) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Telegram not linked with galxe");
    return galxeDetailedInfo.telegramUserID;
  }

  private updatePlayerTelegramId = async (telegramId: string, providerPlayerId: string): Promise<GetBasicPlayerInformationDTO> => {
    const updatedPlayer = await this.playersRepository.updatePlayer(providerPlayerId, {
      galxeTelegramId: telegramId
    });

    return generatePlayerInformationResponse(updatedPlayer);
  }
}