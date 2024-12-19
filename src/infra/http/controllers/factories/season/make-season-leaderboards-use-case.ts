import { SeasonLeaderboardsUseCase } from "../../../../../domain/season/application/use-cases/season-leaderboards-use-case";
import { PrismaPlayerSeasonPointsRepository } from "../../../../database/prisma-repositories/prisma-player-season-points-repository";

export function makeSeasonLeaderboardsUseCase() {
  const playerSeasonPointsRepository = new PrismaPlayerSeasonPointsRepository();
  const sut = new SeasonLeaderboardsUseCase(playerSeasonPointsRepository);
  return sut;
}