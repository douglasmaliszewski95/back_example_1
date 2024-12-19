import { Season } from "../../enterprise/entities/season";

export interface SeasonsRepository {
  create(data: Season): Promise<Season>;
  findActive(): Promise<Season | null>;
  findSeasonByCurrentDate(): Promise<Season | null>;
  updateToInactive(seasonId: number): Promise<Season>;
  updateToActive(seasonId: number): Promise<Season | null>;
  findOverlappingSeason(startAt: Date, endAt: Date): Promise<Season | null>;
}