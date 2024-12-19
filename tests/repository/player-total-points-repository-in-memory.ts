import { randomInt } from "crypto";
import { PlayerTotalPointsRepository } from "../../src/domain/season/application/repositories/player-total-points-repository";
import { AllTimeLeaderboardsDTO, PaginatedTotalPointsLeaderboards, UpdatePlayerTotalPoints } from "../../src/domain/season/application/repositories/player-total-points-repository.types";
import { PlayerTotalPoints } from "../../src/domain/season/enterprise/entities/player-total-points";
import { PlayerLeaderboardImage } from "../../src/domain/season/application/helpers/player-leadearboard-image";

export class PlayerTotalPointsRepositoryInMemory implements PlayerTotalPointsRepository {
  playerPoints: PlayerTotalPoints[] = [];

  async create(data: PlayerTotalPoints): Promise<PlayerTotalPoints> {
    data.id = randomInt(9999);
    await this.playerPoints.push(data);
    return data;
  }

  async update(id: number, data: UpdatePlayerTotalPoints): Promise<void> {
    const pointIndex = this.playerPoints.findIndex(item => item.id === id);
    const playerPoints = this.playerPoints[pointIndex];
    if (data.points) playerPoints.points = data.points;
    if (data.tier) playerPoints.tier = data.tier;
    if (data.tierLastUpdatedTime) playerPoints.tierLastUpdatedTime = data.tierLastUpdatedTime;
  }

  async findByProviderPlayerId(providerPlayerId: string): Promise<PlayerTotalPoints | null> {
    const playerPoints = await this.playerPoints.find(points => points.providerPlayerId === providerPlayerId);
    if (!playerPoints) return null;
    return playerPoints;
  }

  async getAllTimeLeaderboards(limit: number, page: number): Promise<PaginatedTotalPointsLeaderboards> {
    const mappedTotalPoints = this.playerPoints.map(totalPoints => {
      return {
        points: totalPoints.points,
        tier: totalPoints.tier,
        player: {
          username: "",
          avatarUrl: PlayerLeaderboardImage.getPlayerImage(totalPoints.tier, null)
        }
      }
    })
    const orderedTotalPoints = mappedTotalPoints.sort((a, b) => b.points - a.points);
    const paginatedTotalPoints = orderedTotalPoints.slice((page - 1) * limit, page * limit);
    return {
      currentPage: page,
      limit: limit,
      nrOfPages: 1,
      total: 10,
      items: paginatedTotalPoints
    };
  }

  async delete(providerPlayerId: string): Promise<void> {
    const pointsIndex = await this.playerPoints.findIndex(item => item.providerPlayerId === providerPlayerId);
    await this.playerPoints.splice(pointsIndex, 1);
  }
}