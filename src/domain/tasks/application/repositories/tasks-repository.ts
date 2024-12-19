import { Task } from "../../enterprise/entities/task";
import { ListAllPlayersSeasonTasksData, ListAllPlayersSeasonTasksResponse, ListPlayerSeasonTasksData, TaskAllPlayersList, TaskPlayersList } from "./tasks-repository.types";

export interface TasksRepository {
  create(data: Task): Promise<void>;
  findTaskByProviderPlayerIdAndTaskId(providerPlayerId: string, taskId: string): Promise<Task | null>;
  getQuantityOfTasksCompletedOnSeason(seasonId: number, providerPlayerId: string): Promise<number>;
  listPlayerSeasonTasks(data: ListPlayerSeasonTasksData): Promise<TaskPlayersList>;
  listAllPlayersSeasonTasks(data: ListAllPlayersSeasonTasksData): Promise<TaskAllPlayersList>;
}