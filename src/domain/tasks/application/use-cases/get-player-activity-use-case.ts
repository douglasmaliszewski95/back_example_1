import { ActivityTypeEnum } from "../../../../core/enums/activity-type-enum";
import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { env } from "../../../../infra/env";
import { PlayerLeaderboardImage } from "../../../season/application/helpers/player-leadearboard-image";
import { PlayerSeasonPointsRepository } from "../../../season/application/repositories/player-season-points-repository";
import { PlayerTotalPointsRepository } from "../../../season/application/repositories/player-total-points-repository";
import { SeasonsRepository } from "../../../season/application/repositories/seasons-repository";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { Player } from "../../../user/enterprise/entities/player";
import { TasksRepository } from "../repositories/tasks-repository";

interface GetPlayerActivityRequestDTO {
  limit: number;
  page: number;
  username?: string;
}

export interface SavedTask {
  id: string;
  name: string;
  description: string;
}

interface ActivityProps {
  type: ActivityTypeEnum;
  reward: number;
  name: string;
  tasks: {
    id: string | null;
    name: string | null;
    imageUrl: string | null;
  }[],
  lastUpdate: Date;
}

interface GetPlayerActivityResponseDTO {
  avatarUrl: string | null;
  providerPlayerId: string | null;
  seasonTier: number;
  username: string | null;
  activity: ActivityProps;
}

interface GetPlayerActivityCustomDTO {
  limit: number;
  currentPage: number;
  total: number;
  nrOfPages: number;
  items: GetPlayerActivityResponseDTO[]
}

export class GetPlayerActivityUseCase {

  constructor(
    private playersRepository: PlayersRepository,
    private tasksRepository: TasksRepository,
    private seasonsRepository: SeasonsRepository,
    private playerTotalPoints: PlayerTotalPointsRepository,
  ) { }

  public execute = async (data: GetPlayerActivityRequestDTO): Promise<GetPlayerActivityCustomDTO> => {
    const activities = await this.getTasks(data);
    return activities;
  }

  private getTasks = async (data: GetPlayerActivityRequestDTO): Promise<GetPlayerActivityCustomDTO> => {
    if (!data.username) return this.getAllPlayersSeasonTasks(data);
    return this.getPlayerTasks(data);
  }

  private getActiveSeasonId = async (): Promise<number> => {
    const activeSeason = await this.seasonsRepository.findActive();
    if (!activeSeason || !activeSeason.id) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "No active season");
    return activeSeason.id;
  }

  private getPlayerInfo = async (username: string): Promise<Player> => {
    const userExists = await this.playersRepository.findByUsername(username);
    if (!userExists || !userExists.providerPlayerId) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "user not found");
    return userExists;
  }

  private getPlayerCurrentSeasontier = async (providerPlayerId: string) => {
    const playerTotalPoints = await this.playerTotalPoints.findByProviderPlayerId(providerPlayerId);
    let playerTier = 3;
    if (playerTotalPoints) playerTier = playerTotalPoints.tier;
    return playerTier;
  }

  private getPlayerTasks = async (data: GetPlayerActivityRequestDTO): Promise<GetPlayerActivityCustomDTO> => {
    const player = await this.getPlayerInfo(data.username ?? "");
    const activeSeasonId = await this.getActiveSeasonId();
    const playerTasks = await this.tasksRepository.listPlayerSeasonTasks({
      limit: data.limit,
      page: data.page,
      providerPlayerId: player.providerPlayerId ?? "",
      seasonId: activeSeasonId
    });
    const currentSeasonTier = await this.getPlayerCurrentSeasontier(player.providerPlayerId ?? "");

    const list = playerTasks.list.map(task => {
      let tasks: SavedTask[] = [];
      try {
        tasks = JSON.parse(task.description);
      } catch (err) {
        tasks = [{
          name: task.name,
          id: task.taskId?.toString() ?? "",
          description: task.description
        }];
      }
      return {
        avatarUrl: PlayerLeaderboardImage.getPlayerImage(currentSeasonTier, player.avatarUrl ?? null), // Displaying the totalPoints tier instead of seasonTier
        providerPlayerId: player.providerPlayerId ?? "",
        seasonTier: currentSeasonTier, // Displaying the totalPoints tier instead of seasonTier
        username: player.username ?? null,
        activity: {
          id: task.taskId ?? null,
          name: task.name,
          reward: task.points ?? null,
          type: ActivityTypeEnum.POINTS,
          tasks: tasks.map((task: SavedTask) => {
            return {
              id: task.id,
              name: task.name ?? null,
              imageUrl: env.DEFAULT_TASK_IMAGE,
            }
          }),
          lastUpdate: task.createdAt ?? new Date()
        }
      }
    });

    return {
      limit: data.limit,
      currentPage: data.page,
      total: playerTasks.total,
      nrOfPages: playerTasks.totalOfPages,
      items: list
    }
  }

  private getAllPlayersSeasonTasks = async (data: GetPlayerActivityRequestDTO): Promise<GetPlayerActivityCustomDTO> => {
    const activeSeasonId = await this.getActiveSeasonId();
    const activities = await this.tasksRepository.listAllPlayersSeasonTasks({
      page: data.page,
      limit: data.limit,
      seasonId: activeSeasonId
    });

    return {
      limit: data.limit,
      currentPage: data.page,
      total: activities.total,
      nrOfPages: activities.totalOfPages,
      items: activities.list
    }
  }
}