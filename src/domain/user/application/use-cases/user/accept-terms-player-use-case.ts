import { PLAYER_STATUS } from "@prisma/client";
import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { CampaignGateway } from "../../../../campaign/application/gateway/campaign-gateway";
import { GetUserInfoFromGalxeResponseDTO } from "../../../../campaign/application/gateway/campaign-gateway.types";
import { ParametersRepository } from "../../../../parameters/application/repositories/parameters-repository";
import { ParametersResponseDTO } from "../../../../parameters/application/repositories/parameters-repository.types";
import { Player } from "../../../enterprise/entities/player";
import { GetBasicPlayerInformationDTO } from "../../@types/get-player-information-dto";
import { AuthPlayerProvider, GetPlayerResponseDTO } from "../../auth-provider/auth-player-provider";
import { generatePlayerInformationResponse } from "../../helpers/generators";
import { PlayersRepository } from "../../repositories/players-repository";
import { FindPlayerResponse } from "../../repositories/players-repository.types";
import { InvitedPlayersRepository } from "../../repositories/invited-players-repository";
import { Parameters } from "../../../../parameters/enterprise/entities/parameters";

interface AcceptTermsPlayerRequestDTO {
  accepted: boolean;
  inviteCode?: string;
  tokenGalxe: string;
  refreshToken: string;
}

export class AcceptTermsPlayerUseCase {
  constructor(
    private authProvider: AuthPlayerProvider,
    private parametersRepository: ParametersRepository,
    private campaignGateway: CampaignGateway,
    private playersRepository: PlayersRepository,
    private invitedPlayersRepository: InvitedPlayersRepository
  ) {}

  execute = async (data: AcceptTermsPlayerRequestDTO, accessToken: string) => {
    if (!data.accepted) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "You have to accept the terms");
    if (!data.tokenGalxe) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid token");
    if (!data.refreshToken) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid refresh token");

    const { player, galxeInfo, wallet, playerAlreadyRegistered } = await this.getInfoPlayerGalxe(
      accessToken,
      data.tokenGalxe
    );
    const insertParameter = await this.insertParameter(
      data,
      player.providerPlayerId,
      galxeInfo.GalxeID,
      galxeInfo.RefreshTokenGalxe
    );
    if (galxeInfo.Email) {
      const response = await this.insertPlayer(
        player,
        galxeInfo,
        accessToken,
        data.refreshToken,
        wallet,
        playerAlreadyRegistered
      );

      if (data.inviteCode) {
        const invitingPlayer = await this.playersRepository.findByInviteCode(data.inviteCode);
        if (!invitingPlayer || !invitingPlayer.providerPlayerId) return;
        await this.invitedPlayersRepository.create({
          invitedProviderPlayerId: response.providerPlayerId,
          invitingProviderPlayerId: invitingPlayer.providerPlayerId as string,
          inviteCode: data.inviteCode
        });
      }

      return { ...response, message: "player created successfully", code: "1" };
    } else {
      const createPlayer = await this.updatePlayerWallet(player, galxeInfo, playerAlreadyRegistered);
      if (data.inviteCode) {
        const invitingPlayer = await this.playersRepository.findByInviteCode(data.inviteCode);
        if (!invitingPlayer || !invitingPlayer.providerPlayerId) return;
        await this.invitedPlayersRepository.create({
          invitedProviderPlayerId: createPlayer.providerPlayerId,
          invitingProviderPlayerId: invitingPlayer.providerPlayerId as string,
          inviteCode: data.inviteCode
        });
      }
    }

    if (!galxeInfo.Email) {
      const response = insertParameter;

      return { ...response, message: "player was not created", code: "0" };
    }
  };

  private getInfoPlayerGalxe = async (
    accessToken: string,
    tokenGalxe: string
  ): Promise<{
    player: GetPlayerResponseDTO;
    galxeInfo: GetUserInfoFromGalxeResponseDTO;
    wallet: string;
    playerAlreadyRegistered: FindPlayerResponse | null;
  }> => {
    const player = await this.authProvider.getPlayer(accessToken);
    if (!player) throw new HttpException(HttpStatus.UNAUTHORIZED, "Player not found");
    const galxeInfo = await this.campaignGateway.getGalxeUserInformation(tokenGalxe);
    if (!galxeInfo) throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "cannot retrieve galxe information");
    const galxeIdAlreadyRegistered = await this.playersRepository.findByGalxeId(galxeInfo.GalxeID);
    if (galxeIdAlreadyRegistered)
      throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Galxe account already registered");
    let wallet = "";
    const playerAlreadyRegistered = await this.playersRepository.findPlayerByProviderId(player.providerPlayerId);
    if (playerAlreadyRegistered) wallet = playerAlreadyRegistered.wallet as string;

    return {
      player,
      galxeInfo,
      wallet,
      playerAlreadyRegistered
    };
  };

  private insertParameter = async (
    data: AcceptTermsPlayerRequestDTO,
    playerId: string,
    galxeId: string,
    refreshTokenGalxe: string
  ): Promise<Parameters> => {
    const parameterByGalxeId = await this.parametersRepository.findParameterByGalxeId(galxeId);
    if (!parameterByGalxeId) {
      const parameter = Parameters.create({
        galxeId: galxeId,
        termsAccepted: data.accepted,
        userId: playerId,
        refreshToken: data.refreshToken,
        refreshTokenGalxe: refreshTokenGalxe,
        inviteCode: data.inviteCode || ""
      })
      const createParameter = await this.parametersRepository.create(parameter);

      return createParameter;
    }

    const updateParameter = await this.parametersRepository.updateTokenGalxe(
      parameterByGalxeId?.id as number,
      refreshTokenGalxe,
      data.refreshToken,
      playerId
    );

    return updateParameter;
  };

  private insertPlayer = async (
    player: GetPlayerResponseDTO,
    galxeInfo: GetUserInfoFromGalxeResponseDTO,
    accessToken: string,
    refreshToken: string,
    wallet: string,
    playerAlreadyRegistered: FindPlayerResponse | null
  ): Promise<GetBasicPlayerInformationDTO> => {
    let updatedPlayer;
    const data = {
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

    // const playerAlreadyRegistered = await this.playersRepository.findPlayerByProviderId(player.providerPlayerId);
    if (playerAlreadyRegistered !== null) {
      updatedPlayer = await this.playersRepository.updatePlayer(player.providerPlayerId, data);
    } else {
      updatedPlayer = await this.playersRepository.create(Player.create({ ...data, email: galxeInfo.Email ?? "" }));
    }

    await this.authProvider.updateLoginAnonymous({
      accessToken,
      refreshToken,
      address: galxeInfo.Email,
      userId: player.providerPlayerId
    });

    return generatePlayerInformationResponse(updatedPlayer);
  };

  private updatePlayerWallet = async (
    player: GetPlayerResponseDTO,
    galxeInfo: GetUserInfoFromGalxeResponseDTO,
    playerAlreadyRegistered: FindPlayerResponse | null
  ): Promise<GetBasicPlayerInformationDTO> => {
    let updatedPlayer;
    const data = {
      providerPlayerId: player.providerPlayerId,
      status: PLAYER_STATUS.PENDING_ACCOUNT,
      wallet: galxeInfo.Wallet
    };

    // const playerAlreadyRegistered = await this.playersRepository.findPlayerByProviderId(player.providerPlayerId);
    if (playerAlreadyRegistered !== null) {
      updatedPlayer = await this.playersRepository.updatePlayer(player.providerPlayerId, data);
    } else {
      updatedPlayer = await this.playersRepository.create(Player.create({ ...data, email: "" }));
    }

    return generatePlayerInformationResponse(updatedPlayer);
  };
}
