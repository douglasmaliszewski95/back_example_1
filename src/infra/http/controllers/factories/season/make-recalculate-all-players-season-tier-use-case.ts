import { RecalculateAllPlayersASeasonTierUseCase } from "../../../../../domain/season/application/use-cases/recalculate-all-players-season-tier-use-case";
import { PrismaPlayerSeasonPointsRepository } from "../../../../database/prisma-repositories/prisma-player-season-points-repository";
import { PrismaSeasonsRepository } from "../../../../database/prisma-repositories/prisma-seasons-repository";

export function makeRecalculateAllPlayersSeasonTierUseCase() {
  const seasonRepository = new PrismaSeasonsRepository();
  const playerSeasonPointsRepository = new PrismaPlayerSeasonPointsRepository();
  const sut = new RecalculateAllPlayersASeasonTierUseCase(seasonRepository, playerSeasonPointsRepository);
  return sut;
}