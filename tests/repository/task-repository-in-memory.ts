import { randomUUID } from "node:crypto";
import { ActivityTypeEnum } from "../../src/core/enums/activity-type-enum";
import { TasksRepository } from "../../src/domain/tasks/application/repositories/tasks-repository";
import { ListAllPlayersSeasonTasksData, ListAllPlayersSeasonTasksResponse, ListPlayerSeasonTasksData, TaskAllPlayersList, TaskPlayersList } from "../../src/domain/tasks/application/repositories/tasks-repository.types";
import { Task } from "../../src/domain/tasks/enterprise/entities/task";

export class TaskRepositoryInMemory implements TasksRepository {
  tasks: Task[] = [];

  async create(data: Task): Promise<void> {
    this.tasks.push(data);
  }

  async findTaskByProviderPlayerIdAndTaskId(providerPlayerId: string, taskId: string): Promise<Task | null> {
    const task = this.tasks.find(task =>
      task.providerPlayerId === providerPlayerId && task.taskId === taskId
    );

    if (!task) return null;
    return task;
  }

  async getQuantityOfTasksCompletedOnSeason(seasonId: number, providerPlayerId: string): Promise<number> {
    const task = this.tasks.filter(task =>
      task.providerPlayerId === providerPlayerId && task.seasonId === seasonId
    );

    return task.length;
  }

  async listPlayerSeasonTasks(data: ListPlayerSeasonTasksData): Promise<TaskPlayersList> {
    const filteredTasks = await this.tasks.filter(
      task => task.seasonId === data.seasonId && task.providerPlayerId === data.providerPlayerId
    );
    const paginatedTasks = filteredTasks.slice((data.page - 1) * data.limit, data.page * data.limit);
    return {
      list: [{
        name: "string",
        description: "string",
        points: 0,
        completedDate: new Date(),
        providerPlayerId: "string;",
        taskId: "string | null;",
        systemId: "string;",
        seasonId: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }],
      total: paginatedTasks.length,
      totalOfPages: Math.ceil(paginatedTasks.length / data.limit)
    }
  }

  async listAllPlayersSeasonTasks(data: ListAllPlayersSeasonTasksData): Promise<TaskAllPlayersList> {
    const filteredTasks = await this.tasks
      .filter(task => task.seasonId === data.seasonId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
    const paginatedTasks = await filteredTasks.slice((data.page - 1) * data.limit, data.page * data.limit);

    return {
      list: [{
        avatarUrl: "string | null;",
        providerPlayerId: "string | null;",
        seasonTier: 0,
        username: "string | null;",
        activity: {
          type: ActivityTypeEnum.POINTS,
          reward: 0,
          name: "string",
          tasks: [{
            id: "string | null;",
            name: "string | null;",
            imageUrl: "string | null;"
          }],
          lastUpdate: new Date()
        }
      }],
      total: paginatedTasks.length,
      totalOfPages: Math.ceil(paginatedTasks.length / data.limit)
    }
  }
}