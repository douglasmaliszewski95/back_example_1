import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { env } from "../../../../infra/env";
import { PlayerSeasonPointsRepository } from "../../../season/application/repositories/player-season-points-repository";
import { PlayerTotalPointsRepository } from "../../../season/application/repositories/player-total-points-repository";
import { SeasonsRepository } from "../../../season/application/repositories/seasons-repository";
import { PlayerSeasonPoints } from "../../../season/enterprise/entities/player-season-points";
import { PlayerTotalPoints } from "../../../season/enterprise/entities/player-total-points";
import { TasksRepository } from "../../../tasks/application/repositories/tasks-repository";
import { Task } from "../../../tasks/enterprise/entities/task";
import { AuthPlayerProvider } from "../../../user/application/auth-provider/auth-player-provider";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { CampaignGateway } from "../gateway/campaign-gateway";
import { CampaignsTask, GetCampaignsAndQuestsResponse } from "../gateway/campaign-gateway.types";

export class GetCampaignsAndQuestsUseCase {
  constructor(
    private campaignGateway: CampaignGateway,
    private authPlayerProvider: AuthPlayerProvider,
    private playersRepository: PlayersRepository,
    private tasksRepository: TasksRepository,
    private seasonsRepository: SeasonsRepository,
    private playerSeasonPointsRepository: PlayerSeasonPointsRepository,
    private playerTotalPointsRepository: PlayerTotalPointsRepository,
  ) { }

  execute = async (token: string, id?: string) => {
    const { providerPlayerId, galxeId } = await this.getUserInfo(token);
    const spaceInfo = await this.campaignGateway.getCampaignsAndQuests(galxeId);
    const tasksList = await this.getTasks(spaceInfo);
    const completedTasks = await this.getAllEligibleTasks(tasksList);
    if (completedTasks.length > 0) {
      const tasksToCreditatePoints = await this.checkIfTaskIsAlreadyCredited(providerPlayerId, completedTasks);
      if (tasksToCreditatePoints.length > 0) await this.addTaskPointsToUser(providerPlayerId, tasksToCreditatePoints);
    }
    return spaceInfo;
  }

  private getUserInfo = async (token: string): Promise<{ providerPlayerId: string, galxeId: string; }> => {
    const user = await this.authPlayerProvider.getPlayer(token);
    if (!user) throw new HttpException(HttpStatus.UNAUTHORIZED, "User not found");
    const repoPlayer = await this.playersRepository.findPlayerByProviderId(user.providerPlayerId);

    return {
      providerPlayerId: user.providerPlayerId,
      galxeId: repoPlayer?.galxeId ?? ""
    }
  }

  private getTasks = async (spaceInfo: GetCampaignsAndQuestsResponse): Promise<CampaignsTask[]> => {
    return spaceInfo.campaigns.flatMap(campaign => {
      const campaignName = campaign.name;
      return campaign.tasks.map(task => {
        return {
          ...task,
          name: campaignName
        }
      });
    });
  }

  private getAllEligibleTasks = async (tasks: CampaignsTask[]): Promise<CampaignsTask[]> => {
    return tasks.filter(task => task.eligible);
  }

  private checkIfTaskIsAlreadyCredited = async (providerPlayerId: string, completedTasks: CampaignsTask[]) => {
    let tasksToAdd: CampaignsTask[] = [];
    for (const task of completedTasks) {
      const taskAlreadyExists = await this.tasksRepository.findTaskByProviderPlayerIdAndTaskId(providerPlayerId, task.id);
      if (!taskAlreadyExists) tasksToAdd.push(task);
    }
    return tasksToAdd;
  }

  private addTaskPointsToUser = async (providerPlayerId: string, tasksToAdd: CampaignsTask[]) => {
    const activeSeason = await this.seasonsRepository.findActive();
    if (!activeSeason || !activeSeason.id) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "No active season");
    for (const galxeTask of tasksToAdd) {
      const description = galxeTask.conditions.map(task => {
        if (!task.eligible) return;
        return {
          id: task.id,
          name: task.name,
          description: task.description
        }
      }).filter(Boolean);
      const loyaltyRewardPoints = galxeTask.rewardPoints.find(task => task.rewardType === "LOYALTYPOINTS");
      if (!loyaltyRewardPoints) return;
      const task = Task.create({
        systemId: env.DEFAULT_GALXE_TASK_SYSTEM,
        seasonId: activeSeason.id,
        completedDate: new Date(),
        name: galxeTask.name ?? "",
        description: JSON.stringify(description),
        points: parseInt(loyaltyRewardPoints.rewardPoints),
        providerPlayerId,
        taskId: galxeTask.id
      });
      await this.tasksRepository.create(task);
      await this.includePlayerPoints(providerPlayerId, parseInt(loyaltyRewardPoints.rewardPoints), activeSeason.id);
    }
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
        progress: 0
      });
      return await this.playerTotalPointsRepository.create(totalPoints);
    }

    const updatedTotalPoints = await this.playerTotalPointsRepository.update(totalPoints.id ?? 0, {
      points: totalPoints.points + pointsToAdd
    });

    return updatedTotalPoints;
  }
}