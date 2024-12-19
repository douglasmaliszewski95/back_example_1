import { PLAYER_STATUS } from "../../../../../core/enums/player-status-enum";
import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { PlayerLeaderboardImage } from "../../../../season/application/helpers/player-leadearboard-image";
import { PlayerSeasonPointsRepository } from "../../../../season/application/repositories/player-season-points-repository";
import { PlayerTotalPointsRepository } from "../../../../season/application/repositories/player-total-points-repository";
import { SeasonsRepository } from "../../../../season/application/repositories/seasons-repository";
import { PlayerSeasonPoints } from "../../../../season/enterprise/entities/player-season-points";
import { PlayerTotalPoints } from "../../../../season/enterprise/entities/player-total-points";
import { TasksRepository } from "../../../../tasks/application/repositories/tasks-repository";
import { Player } from "../../../enterprise/entities/player";
import { GetBasicPlayerInformationDTO, GetPlayerInformationDTO } from "../../@types/get-player-information-dto";
import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";
import { generateFindPlayerResponse, generatePlayerInformationResponse } from "../../helpers/generators";
import { PlayersRepository } from "../../repositories/players-repository";

interface GetPlayerInfoRequestDTO {
  token?: string;
}

export class GetPlayerInfoUseCase {
  constructor(
    private authProvider: AuthPlayerProvider,
    private playersRepository: PlayersRepository,
    private playerSeasonPointsRepository: PlayerSeasonPointsRepository,
    private playerTotalPointsRepository: PlayerTotalPointsRepository,
    private seasonsRepository: SeasonsRepository,
    private tasksRepository: TasksRepository
  ) { }

  execute = async (data: GetPlayerInfoRequestDTO): Promise<GetPlayerInformationDTO | null> => {
    if (!data.token) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
    const activeSeason = await this.seasonsRepository.findActive();
    if (!activeSeason || !activeSeason.id) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "no season active");
    const playerInfo = await this.getPlayerInfo(data.token);
    const pointsInfo = await this.checkAndCreateSeasonAndTotalPointsForNewPlayer(
      activeSeason.id,
      playerInfo.providerPlayerId
    );
    const playerSeasonPosition = await this.getPlayerSeasonPosition(activeSeason.id, playerInfo.providerPlayerId);
    const seasonTasksCompleted = await this.getQuantityOfSeasonTasksCompleted(
      activeSeason.id,
      playerInfo.providerPlayerId
    );

    return {
      ...playerInfo,
      ...pointsInfo,
      avatarUrl: PlayerLeaderboardImage.getPlayerImage(pointsInfo.totalPoints.tier, playerInfo.avatarUrl),
      seasonPositition: playerSeasonPosition,
      seasonTasksCompleted: seasonTasksCompleted
    };
  };

  private getPlayerInfo = async (accessToken: string): Promise<GetBasicPlayerInformationDTO> => {
    const currentToken = accessToken.split(" ");
    const token = currentToken[1];
    const providerPlayer = await this.authProvider.getPlayer(token);
    if (!providerPlayer) throw new HttpException(HttpStatus.UNAUTHORIZED, "Player not found");
    const providerPlayerId = providerPlayer.providerPlayerId;
    const repositoryPlayer = await this.playersRepository.findPlayerByProviderId(providerPlayerId);

    if (!repositoryPlayer) {
      const newRepositoryPlayer = await this.playersRepository.create(
        Player.create({
          supabaseEmail: providerPlayer.email ?? "",
          email: providerPlayer.email ?? "",
          galxeDiscordId: undefined,
          galxeEmail: undefined,
          galxeId: undefined,
          galxeTwitterId: undefined,
          galxeTelegramId: undefined,
          providerPlayerId: providerPlayerId,
          status: PLAYER_STATUS.PENDING_ACCOUNT,
          origin: providerPlayer.provider
        })
      );

      return generatePlayerInformationResponse(newRepositoryPlayer);
    }

    return generateFindPlayerResponse(repositoryPlayer);
  };

  private getPlayerSeasonPosition = async (seasonId: number, providerPlayerId: string): Promise<number> => {
    return this.playerSeasonPointsRepository.getSeasonPlayerPosition(seasonId, providerPlayerId);
  };

  private getQuantityOfSeasonTasksCompleted = async (seasonId: number, providerPlayerId: string): Promise<number> => {
    return await this.tasksRepository.getQuantityOfTasksCompletedOnSeason(seasonId, providerPlayerId);
  };

  private checkAndCreateSeasonAndTotalPointsForNewPlayer = async (
    seasonId: number,
    providerPlayerId: string
  ): Promise<{
    totalPoints: PlayerTotalPoints;
    seasonPoints: PlayerSeasonPoints;
  }> => {
    const totalPoints = await this.checkAndCreatePlayerTotalPoints(providerPlayerId);
    const seasonPoints = await this.checkAndCreatePlayerSeasonPoints(seasonId, providerPlayerId);

    return {
      seasonPoints,
      totalPoints
    };
  };

  private checkAndCreatePlayerTotalPoints = async (providerPlayerId: string): Promise<PlayerTotalPoints> => {
    const playerTotalPoints = await this.playerTotalPointsRepository.findByProviderPlayerId(providerPlayerId);
    if (!playerTotalPoints) {
      return await this.playerTotalPointsRepository.create(
        PlayerTotalPoints.create({
          points: 0,
          providerPlayerId: providerPlayerId,
          tierLastUpdatedTime: new Date(),
          tier: 3,
          progress: 0
        })
      );
    }

    return playerTotalPoints;
  };

  private checkAndCreatePlayerSeasonPoints = async (
    seasonId: number,
    providerPlayerId: string
  ): Promise<PlayerSeasonPoints> => {
    const playerSeasonPoints = await this.playerSeasonPointsRepository.findBySeasonAndProviderPlayerId(
      seasonId,
      providerPlayerId
    );
    if (!playerSeasonPoints) {
      return await this.playerSeasonPointsRepository.create(
        PlayerSeasonPoints.create({
          seasonId: seasonId,
          providerPlayerId: providerPlayerId,
          points: 0,
          tier: 3,
          lastTier: 3,
          progress: 0
        })
      );
    }

    return playerSeasonPoints;
  };
}
