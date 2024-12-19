import { ActivityTypeEnum } from "../../../../core/enums/activity-type-enum";

interface ListPlayerSeasonTasksData {
  page: number;
  limit: number;
  providerPlayerId: string;
  seasonId: number;
}

interface ListAllPlayersSeasonTasksData {
  page: number;
  limit: number;
  seasonId: number;
}

interface SavedTask {
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

interface ListAllPlayersSeasonTasksResponse {
  avatarUrl: string | null;
  providerPlayerId: string | null;
  seasonTier: number;
  username: string | null;
  activity: ActivityProps;
}

interface PrismaSelectAllPlayersTaskResponse {
  name: string;
  description: string;
  systemId: string;
  points: number;
  createdAt: Date;
  Player: {
    providerPlayerId: string | null;
    username: string | null;
    avatarUrl: string | null;
    PlayerSeasonPoints: {
      tier: number;
    }[];
  } | null;
}

interface TaskPlayersList {
  list: {
    name: string;
    description: string;
    points: number;
    completedDate: Date | null;
    providerPlayerId: string;
    taskId: string | null;
    systemId: string;
    seasonId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  }[];
  total: number;
  totalOfPages: number;
}

interface TaskAllPlayersList {
  list: {
    avatarUrl: string | null;
    providerPlayerId: string | null;
    seasonTier: number;
    username: string | null;
    activity: ActivityProps;
  }[];
  total: number;
  totalOfPages: number;
}


export { ListPlayerSeasonTasksData, ListAllPlayersSeasonTasksData, ListAllPlayersSeasonTasksResponse, PrismaSelectAllPlayersTaskResponse, TaskPlayersList, TaskAllPlayersList };