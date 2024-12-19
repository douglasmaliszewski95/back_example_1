import { randomInt } from "crypto";
import { PlayerSeasonPointsRepository } from "../../src/domain/season/application/repositories/player-season-points-repository";
import { PlayerSeasonPoints } from "../../src/domain/season/enterprise/entities/player-season-points";
import { PaginatedSeasonLeaderboards, UpdatePlayerSeasonPointsRequest } from "../../src/domain/season/application/repositories/player-season-points-repository.types";
import { PlayerLeaderboardImage } from "../../src/domain/season/application/helpers/player-leadearboard-image";

export class PlayerSeasonPointsRepositoryInMemory implements PlayerSeasonPointsRepository {
  playerPoints: PlayerSeasonPoints[] = [];

  async create(data: PlayerSeasonPoints): Promise<PlayerSeasonPoints> {
    data.id = randomInt(9999);
    await this.playerPoints.push(data);
    return data;
  }

  async getDescendingPlayersPointsForSeason(seasonId: number): Promise<PlayerSeasonPoints[]> {
    const seasonPoints = await this.playerPoints.filter(pp => pp.seasonId === seasonId);
    await seasonPoints.sort((a, b) => b.points - a.points);

    return seasonPoints.map(pp => pp);
  }

  async updatePlayerPointsRegister(id: number, data: UpdatePlayerSeasonPointsRequest): Promise<void> {
    const playerPoint = await this.playerPoints.find(pp => pp.id === id);

    if (!playerPoint) {
      console.log("Register not found");
      return;
    }

    if (data.newTier) playerPoint.tier = data.newTier;
    if (data.points) playerPoint.points = data.points;
    if (data.lastTier) playerPoint.lastTier = data.lastTier;
  }

  async findBySeasonAndProviderPlayerId(seasonId: number, providerPlayerId: string): Promise<PlayerSeasonPoints | null> {
    const seasonPoints = await this.playerPoints.find(
      points => points.seasonId === seasonId && points.providerPlayerId === providerPlayerId
    );
    if (!seasonPoints) return null;
    return seasonPoints;
  }

  async findBySeasonId(seasonId: number): Promise<PlayerSeasonPoints[]> {
    const seasonPoints = await this.playerPoints.filter(points => points.seasonId === seasonId);

    return seasonPoints;
  }

  async getSeasonLeaderboards(limit: number, page: number): Promise<PaginatedSeasonLeaderboards> {
    const filteredBySeason = this.playerPoints.filter(seasonPoints => seasonPoints.seasonId === 1);
    const mappedSeasonPoints = filteredBySeason.map(seasonPoints => {
      return {
        seasonId: seasonPoints.seasonId,
        points: seasonPoints.points,
        tier: seasonPoints.tier,
        seasonTier: seasonPoints.tier,
        player: {
          username: "",
          avatarUrl: PlayerLeaderboardImage.getPlayerImage(seasonPoints.tier, null)
        }
      }
    })
    const orderedSeasonPoints = mappedSeasonPoints.sort((a, b) => {
      const order = b.points - a.points;
        if (order === 0) return a.tier - b.tier;
      return order;
    });
    const paginatedSeasonPoints = orderedSeasonPoints.slice((page - 1) * limit, page * limit);
    return {
      currentPage: page,
      limit: limit,
      nrOfPages: 1,
      total: 10,
      items: paginatedSeasonPoints
    };
  }

  async getPlayerAllSeasonRegistries(providerPlayerId: string): Promise<PlayerSeasonPoints[]> {
    return this.playerPoints.filter(registry => registry.providerPlayerId === providerPlayerId);
  }

  async deleteAllSeasonsPlayerRegistries(providerPlayerId: string): Promise<void> {
    this.playerPoints = this.playerPoints.filter(registry => registry.providerPlayerId !== providerPlayerId);
  }

  async getSeasonPlayerPosition(seasonId: number, providerPlayerId: string): Promise<number> {
    const filteredBySeason = this.playerPoints.filter(seasonPoints => seasonPoints.seasonId === seasonId);
    const index = filteredBySeason.findIndex(p => p.providerPlayerId === providerPlayerId);
    return index + 1;
  }
}