import { randomInt } from "crypto";
import { SeasonsRepository } from "../../src/domain/season/application/repositories/seasons-repository";
import { Season } from "../../src/domain/season/enterprise/entities/season";

export class SeasonsRepositoryInMemory implements SeasonsRepository {
  seasons: Season[] = []

  async create(data: Season): Promise<Season> {
    data.id = randomInt(900);
    this.seasons.push(data);
    return data;
  }

  async findActive(): Promise<Season | null> {
    const activeSeason = this.seasons.find(season => season.active);
    if (!activeSeason) return null;
    return activeSeason;
  }

  async findSeasonByCurrentDate(): Promise<Season | null> {
    const currentDate = new Date();
    const currentSeason = this.seasons.find(season =>
      currentDate >= new Date(season.startAt) && currentDate <= new Date(season.endAt)
    );

    if (!currentSeason) return null;
    return currentSeason;
  }

  async updateToInactive(seasonId: number): Promise<Season> {
    const seasonIndex = this.seasons.findIndex((item) => item.id === seasonId);
    const season = this.seasons[seasonIndex];
    season.active = false;
    return season;
  }

  async updateToActive(seasonId: number): Promise<Season | null> {
    const seasonIndex = this.seasons.findIndex((item) => item.id === seasonId);
    if (seasonIndex === -1) return null;
    const season = this.seasons[seasonIndex];
    season.active = true;
    return season;
  }

  async findOverlappingSeason(startAt: Date, endAt: Date): Promise<Season | null> {
    const overlapingSeason = await this.seasons.find(season => {
      return (season.startAt <= endAt && season.endAt >= startAt);
    });

    if (!overlapingSeason) return null;
    return overlapingSeason;
  }
}