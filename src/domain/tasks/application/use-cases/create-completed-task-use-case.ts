import { SystemStatus } from "../../../../core/enums/system-status-enum";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { PlayerSeasonPointsRepository } from "../../../season/application/repositories/player-season-points-repository";
import { PlayerTotalPointsRepository } from "../../../season/application/repositories/player-total-points-repository";
import { SeasonsRepository } from "../../../season/application/repositories/seasons-repository";
import { PlayerSeasonPoints } from "../../../season/enterprise/entities/player-season-points";
import { PlayerTotalPoints } from "../../../season/enterprise/entities/player-total-points";
import { Season } from "../../../season/enterprise/entities/season";
import { SystemRepository } from "../../../system/application/repositories/system-repository";
import { System } from "../../../system/enterprise/entities/system";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { FindPlayerResponse } from "../../../user/application/repositories/players-repository.types";
import { Task } from "../../enterprise/entities/task";
import { TasksRepository } from "../repositories/tasks-repository";

interface CreateCompletedTaskRequestDTO {
  name: string;
  description: string;
  points: number;
  completedDate: Date;
  providerPlayerId?: string;
  telegramId?: string;
  taskId?: string;
}

interface CreateCompletedTask {
  name: string;
  description: string;
  points: number;
  completedDate: Date;
  providerPlayerId: string;
  telegramId?: string;
  taskId?: string;
}

export class CreateCompletedTaskUseCase {

  constructor(
    private tasksRepository: TasksRepository,
    private playersRepository: PlayersRepository,
    private systemsRepository: SystemRepository,
    private playerSeasonPointsRepository: PlayerSeasonPointsRepository,
    private playerTotalPointsRepository: PlayerTotalPointsRepository,
    private seasonsRepository: SeasonsRepository
  ) { }

  execute = async (system: string, data: CreateCompletedTaskRequestDTO): Promise<Task> => {
    if (!data.providerPlayerId && !data.telegramId) throw new HttpException(HttpStatus.BAD_REQUEST, "telegramId or providerPlayerId required");
    const systemFounded = await this.checkAndUpdateSystem(system);
    if (data.points <= 0) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid amount of points");
    const currentPlayer = await this.checkIfPlayerExists(data.providerPlayerId, data.telegramId);
    const currentSeason = await this.getCurrentActiveSeason();
    await this.includePlayerPoints(currentPlayer.providerPlayerId, data.points, currentSeason.id ?? 0);

    return await this.createTask(systemFounded.systemId, {
      ...data,
      providerPlayerId: currentPlayer.providerPlayerId
    }, currentSeason.id ?? 0);
  }

  private checkAndUpdateSystem = async (systemId: string): Promise<System> => {
    const systemExists = await this.systemsRepository.findBySystemId(systemId);
    if (!systemExists) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid system");
    const systemInactive = systemExists.status === SystemStatus.INACTIVE;
    if (systemInactive) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid system");
    const systemPending = systemExists.status === SystemStatus.PENDING;
    if (systemPending) await this.systemsRepository.update({
      id: systemExists.id ?? 0,
      status: SystemStatus.ACTIVE,
      description: systemExists.description,
      name: systemExists.name
    });

    return systemExists;
  }

  private getCurrentActiveSeason = async (): Promise<Season> => {
    const activeSeason = await this.seasonsRepository.findActive();
    if (!activeSeason || !activeSeason?.id) throw new HttpException(HttpStatus.NOT_ACCEPTABLE, "there is no season available");
    return activeSeason;
  }

  private checkIfPlayerExists = async (providerPlayerId?: string, telegramId?: string): Promise<FindPlayerResponse> => {
    let player: FindPlayerResponse | null = null;
    if (providerPlayerId) player = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    if (telegramId) player = await this.playersRepository.findPlayerByTelegramId(telegramId);
    if (!player) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "user does not exists");
    return player;
  }

  private createTask = async (systemId: string, data: CreateCompletedTask, seasonId: number): Promise<Task> => {
    const task = Task.create({
      systemId: systemId,
      seasonId,
      ...data
    });

    await this.tasksRepository.create(task);

    return task;
  }

  private includePlayerPoints = async (providerPlayerId: string, pointsToAdd: number, seasonId: number): Promise<void> => {

    await this.includeSeasonPoints(seasonId, providerPlayerId, pointsToAdd);
    await this.includeTotalPoints(providerPlayerId, pointsToAdd);
  }

  private includeSeasonPoints = async (seasonId: number, providerPlayerId: string, pointsToAdd: number) => {
    const seasonPoints = await this.playerSeasonPointsRepository.findBySeasonAndProviderPlayerId(seasonId, providerPlayerId);
    if (!seasonPoints) {
      const seasonPoints = PlayerSeasonPoints.create({
        points: pointsToAdd,
        providerPlayerId: providerPlayerId,
        seasonId: seasonId,
        tier: 3,
        lastTier: 3,
        progress: 0
      });
      return await this.playerSeasonPointsRepository.create(seasonPoints);
    }

    const updatedSeasonPoints = await this.playerSeasonPointsRepository.updatePlayerPointsRegister(seasonPoints.id ?? 0, {
      points: seasonPoints.points + pointsToAdd
    });

    return updatedSeasonPoints;
  }

  private includeTotalPoints = async (providerPlayerId: string, pointsToAdd: number) => {
    const totalPoints = await this.playerTotalPointsRepository.findByProviderPlayerId(providerPlayerId);
    if (!totalPoints) {
      const totalPoints = PlayerTotalPoints.create({
        points: pointsToAdd,
        providerPlayerId: providerPlayerId,
        tierLastUpdatedTime: new Date(),
        tier: 3,
        progress: 0,
      });
      return await this.playerTotalPointsRepository.create(totalPoints);
    }

    const updatedTotalPoints = await this.playerTotalPointsRepository.update(totalPoints.id ?? 0, {
      points: totalPoints.points + pointsToAdd
    });

    return updatedTotalPoints;
  }
}