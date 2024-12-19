import { PlayerSeasonPoints } from "../../enterprise/entities/player-season-points";
import { PaginatedSeasonLeaderboards, UpdatePlayerSeasonPointsRequest } from "./player-season-points-repository.types";

export interface PlayerSeasonPointsRepository {
  create(data: PlayerSeasonPoints): Promise<PlayerSeasonPoints>;
  getDescendingPlayersPointsForSeason(seasonId: number): Promise<PlayerSeasonPoints[]>;
  updatePlayerPointsRegister(id: number, data: UpdatePlayerSeasonPointsRequest): Promise<void>;
  findBySeasonAndProviderPlayerId(seasonId: number, providerPlayerId: string): Promise<PlayerSeasonPoints | null>;
  findBySeasonId(seasonId: number): Promise<PlayerSeasonPoints[]>;
  getPlayerAllSeasonRegistries(providerPlayerId: string): Promise<PlayerSeasonPoints[]>
  getSeasonLeaderboards(limit: number, page: number): Promise<PaginatedSeasonLeaderboards>;
  getSeasonPlayerPosition(seasonId: number, providerPlayerId: string): Promise<number>
  deleteAllSeasonsPlayerRegistries(providerPlayerId: string): Promise<void>;
}