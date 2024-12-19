import { Prisma, Task as PrismaTask } from '@prisma/client'
import { Task } from '../../../domain/tasks/enterprise/entities/task'
import { ListAllPlayersSeasonTasksResponse, PrismaSelectAllPlayersTaskResponse } from '../../../domain/tasks/application/repositories/tasks-repository.types'
import { ActivityTypeEnum } from '../../../core/enums/activity-type-enum'
import { SavedTask } from '../../../domain/tasks/application/use-cases/get-player-activity-use-case'
import { env } from '../../env'

export class PrismaTasksMapper {
  static toPrisma(task: Task): Prisma.TaskUncheckedCreateInput {
    return {
      providerPlayerId: task.providerPlayerId,
      description: task.description,
      name: task.name,
      points: task.points,
      taskId: task.taskId,
      completedDate: task.completedDate,
      seasonId: task.seasonId,
      systemId: task.systemId,
    }
  }

  static toEntity(task: PrismaTask): Task {
    return Task.create({
      completedDate: task.completedDate ?? new Date(),
      description: task.description,
      name: task.name,
      points: task.points,
      providerPlayerId: task.providerPlayerId,
      seasonId: task.seasonId ?? 0,
      systemId: task.systemId,
      taskId: task.taskId ?? "",
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    })
  }

  static toListAllPlayersSeasonTasksResponse(data: PrismaSelectAllPlayersTaskResponse): ListAllPlayersSeasonTasksResponse {
    let tasks: SavedTask[] = [];
    try {
      tasks = JSON.parse(data.description);
    } catch (err) {
      tasks = [{
        name: data.name,
        description: data.description,
        id: ""
      }];
    }
    const player = data.Player;
    const seasonTier = player?.PlayerSeasonPoints ? player?.PlayerSeasonPoints[0].tier : 3
    return {
      avatarUrl: player?.avatarUrl ?? null,
      providerPlayerId: player?.providerPlayerId ?? null,
      seasonTier: seasonTier ?? 3,
      username: player?.username ?? null,
      activity: {
        lastUpdate: data.createdAt,
        reward: data.points,
        name: data.name,
        tasks: tasks.map((task: SavedTask) => {
          return {
            id: task.id,
            name: task.name ?? null,
            imageUrl: env.DEFAULT_TASK_IMAGE,
          }
        }),
        type: ActivityTypeEnum.POINTS,
      },
    };
  }
}