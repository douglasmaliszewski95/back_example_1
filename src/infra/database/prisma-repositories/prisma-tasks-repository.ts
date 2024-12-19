import { TasksRepository } from "../../../domain/tasks/application/repositories/tasks-repository";
import { ListAllPlayersSeasonTasksData, ListAllPlayersSeasonTasksResponse, ListPlayerSeasonTasksData, TaskAllPlayersList, TaskPlayersList } from "../../../domain/tasks/application/repositories/tasks-repository.types";
import { Task } from "../../../domain/tasks/enterprise/entities/task";
import { PrismaTasksMapper } from "../mappers/prisma-tasks-mapper";
import { prisma } from "../prisma";

export class PrismaTasksRepository implements TasksRepository {
  async create(data: Task): Promise<void> {
    const payload = PrismaTasksMapper.toPrisma(data);
    await prisma.task.create({
      data: payload
    });
  }

  async findTaskByProviderPlayerIdAndTaskId(providerPlayerId: string, taskId: string): Promise<Task | null> {
    const task = await prisma.task.findFirst({
      where: {
        providerPlayerId,
        taskId
      }
    });

    if (!task) return null;
    return PrismaTasksMapper.toEntity(task);
  }

  async getQuantityOfTasksCompletedOnSeason(seasonId: number, providerPlayerId: string): Promise<number> {
    const quantity = await prisma.task.count({
      where: {
        seasonId,
        providerPlayerId
      }
    });

    return quantity;
  }

  async listPlayerSeasonTasks(data: ListPlayerSeasonTasksData): Promise<TaskPlayersList> {
    const [list, count] = await prisma.$transaction([
      prisma.task.findMany({
        where: {
          seasonId: data.seasonId,
          providerPlayerId: data.providerPlayerId
        },
        orderBy: {
          createdAt: "desc"
        },
        take: data.limit,
        skip: (data.page - 1) * data.limit
      }),
      prisma.task.count({
        where: {
          seasonId: data.seasonId,
          providerPlayerId: data.providerPlayerId
        }
      })
    ]); 

    return {
      list: list,
      total: count,
      totalOfPages: Math.ceil(count / data.limit)
    }
  }

  async listAllPlayersSeasonTasks(data: ListAllPlayersSeasonTasksData): Promise<TaskAllPlayersList> {
    const [tasks, count] = await prisma.$transaction([
      prisma.task.findMany({
        where: {
          seasonId: data.seasonId
        },
        orderBy: {
          createdAt: "desc"
        },
        take: data.limit,
        skip: (data.page - 1) * data.limit,
        select: {
          createdAt: true,
          description: true,
          points: true,
          systemId: true,
          name: true,
          Player: {
            select: {
              avatarUrl: true,
              username: true,
              providerPlayerId: true,
              PlayerSeasonPoints: {
                where: {
                  seasonId: data.seasonId,
                },
                select: {
                  tier: true,
                }
              }
            }
          }
        }
      }),
      prisma.task.count({
        where: {
          seasonId: data.seasonId
        }
      })
    ]); 

    return {
      list: tasks.map(PrismaTasksMapper.toListAllPlayersSeasonTasksResponse),
      total: count,
      totalOfPages: Math.ceil(count / data.limit)
    }
  }
}