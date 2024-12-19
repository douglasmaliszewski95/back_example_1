import { PLAYER_STATUS } from "../../../../core/enums/player-status-enum";

export interface PlayersReportFilters {
  id?: number;
  tier?: number[];
  username?: string;
  wallet?: string;
  seasonPointsStart?: number;
  seasonPointsEnd?: number;
  totalPointsStart?: number;
  totalPointsEnd?: number;
  startCreatedAt?: Date;
  endCreatedAt?: Date;
  status?: PLAYER_STATUS[];
  email?: string;
}
