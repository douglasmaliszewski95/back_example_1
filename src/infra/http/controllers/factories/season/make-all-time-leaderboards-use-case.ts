import { AllTimeLeaderboardsUseCase } from "../../../../../domain/season/application/use-cases/all-time-leaderboards-use-case";
import { PrismaPlayerTotalPointsRepository } from "../../../../database/prisma-repositories/prisma-player-total-points-repository";

export function makeAllTimeLeaderboardsUseCase() {
  const playerTotalPointsRepository = new PrismaPlayerTotalPointsRepository();
  const sut = new AllTimeLeaderboardsUseCase(playerTotalPointsRepository);
  return sut;
}