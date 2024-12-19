import { PlayerTotalPoints } from "../../enterprise/entities/player-total-points";
import { PaginatedTotalPointsLeaderboards, UpdatePlayerTotalPoints } from "./player-total-points-repository.types";

export interface PlayerTotalPointsRepository {
  create(data: PlayerTotalPoints): Promise<PlayerTotalPoints>;
  update(id: number, data: UpdatePlayerTotalPoints): Promise<void>;
  findByProviderPlayerId(providerPlayerId: string): Promise<PlayerTotalPoints | null>;
  getAllTimeLeaderboards(limit: number, page: number): Promise<PaginatedTotalPointsLeaderboards>;
  delete(providerPlayerId: string): Promise<void>;
}