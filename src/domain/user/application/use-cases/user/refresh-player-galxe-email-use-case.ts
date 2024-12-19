import { PLAYER_STATUS } from "../../../../../core/enums/player-status-enum";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { HttpException } from "../../../../../core/errors/HttpException";
import { CampaignGateway } from "../../../../campaign/application/gateway/campaign-gateway";
import { GetUserInfoFromGalxeResponseDTO } from "../../../../campaign/application/gateway/campaign-gateway.types";
import { ParametersRepository } from "../../../../parameters/application/repositories/parameters-repository";
import { Player } from "../../../enterprise/entities/player";
import { GetBasicPlayerInformationDTO } from "../../@types/get-player-information-dto";
import { AuthPlayerProvider, GetPlayerResponseDTO } from "../../auth-provider/auth-player-provider";
import { generatePlayerInformationResponse } from "../../helpers/generators";
import { PlayersRepository } from "../../repositories/players-repository";

export class RefreshPlayerGalxeEmailUseCase {
  constructor(
    private campaignGateway: CampaignGateway,
    private playersRepository: PlayersRepository,
    private authPlayerProvider: AuthPlayerProvider,
    private parametersRepository: ParametersRepository
  ) {}

  public execute = async (accessToken: string): Promise<GetPlayerResponseDTO> => {
    const user = await this.authPlayerProvider.getPlayer(accessToken);
    if (user) {
      const playerAlreadyRegistered = await this.playersRepository.findPlayerByProviderId(user.providerPlayerId);
      if (playerAlreadyRegistered?.galxeEmail) return playerAlreadyRegistered;
    }
    const { player, galxeInfo, refreshToken, wallet } = await this.getInfoPlayerGalxe(accessToken);
    return galxeInfo.Email
      ? await this.insertPlayer(player, galxeInfo, accessToken, refreshToken, wallet)
      : player;
  };

  private getInfoPlayerGalxe = async (
    accessToken: string
  ): Promise<{
    player: GetPlayerResponseDTO;
    galxeInfo: GetUserInfoFromGalxeResponseDTO;
    refreshToken: string;
    wallet: string;
  }> => {
    const player = await this.authPlayerProvider.getPlayer(accessToken);
    if (!player) throw new HttpException(HttpStatus.UNAUTHORIZED, "Player not found");
    const parameterPlayer = await this.parametersRepository.findParameterById(player.providerPlayerId);
    if (!parameterPlayer)
      throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "cannot retrieve parameter information");
    const galxeInfo = await this.campaignGateway.getInfoGalxeUser(parameterPlayer.refreshTokenGalxe);
    if (!galxeInfo) throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "cannot retrieve galxe information");
    const updateParameter = await this.parametersRepository.updateTokenGalxe(
      parameterPlayer.id as number,
      galxeInfo.RefreshTokenGalxe,
      parameterPlayer.refreshToken,
      parameterPlayer.userId
    );
    if (!updateParameter)
      throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "cannot update parameter from player");
    // const galxeInfo = await this.campaignGateway.getGalxeUserDetailedInformation(parameterPlayer.galxeId);
    // if (!galxeInfo) throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "cannot retrieve galxe information");
    const galxeIdAlreadyRegistered = await this.playersRepository.findByGalxeId(galxeInfo.GalxeID);
    if (galxeIdAlreadyRegistered)
      throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Galxe account already registered");
    let wallet = '';
    const playerAlreadyRegistered = await this.playersRepository.findPlayerByProviderId(player.providerPlayerId);
    if (playerAlreadyRegistered) wallet = playerAlreadyRegistered.wallet as string

    return {
      player,
      galxeInfo,
      refreshToken: parameterPlayer?.refreshToken,
      wallet
    };
  };

  private insertPlayer = async (
    player: GetPlayerResponseDTO,
    galxeInfo: GetUserInfoFromGalxeResponseDTO,
    accessToken: string,
    refreshToken: string,
    wallet: string
  ): Promise<GetBasicPlayerInformationDTO> => {
    let updatedPlayer;
    let data = {
      supabaseEmail: galxeInfo.Email ?? "",
      galxeDiscordId: galxeInfo.DiscordUserID ?? undefined,
      galxeEmail: galxeInfo.Email ?? undefined,
      galxeId: galxeInfo.GalxeID ?? undefined,
      galxeTwitterId: galxeInfo.TwitterUserID ?? undefined,
      galxeTelegramId: galxeInfo.TelegramUserID ?? undefined,
      providerPlayerId: player.providerPlayerId,
      status: PLAYER_STATUS.ACTIVE,
      origin: player.provider,
      username: galxeInfo.Name,
      wallet: wallet || galxeInfo.Wallet,
      inviteCode: galxeInfo.Name
    };
    const playerAlreadyRegistered = await this.playersRepository.findPlayerByProviderId(player.providerPlayerId);
    if (playerAlreadyRegistered !== null) {
      updatedPlayer = await this.playersRepository.updatePlayer(player.providerPlayerId, data);
    } else {
      updatedPlayer = await this.playersRepository.create(Player.create({ ...data, email: galxeInfo.Email ?? "" }));
    }

    await this.authPlayerProvider.updateLoginAnonymous({
      accessToken,
      refreshToken,
      address: galxeInfo.Email,
      userId: player.providerPlayerId
    });

    return generatePlayerInformationResponse(updatedPlayer);
  };
}
