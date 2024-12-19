import { CheckCurrentSeasonUseCase } from "../../../../../domain/season/application/use-cases/check-current-season-use-case";
import { PrismaApplicationLogRepository } from "../../../../database/prisma-repositories/prisma-application-log-repository";
import { PrismaPlayerSeasonPointsRepository } from "../../../../database/prisma-repositories/prisma-player-season-points-repository";
import { PrismaPlayerTotalPointsRepository } from "../../../../database/prisma-repositories/prisma-player-total-points-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PrismaSeasonsRepository } from "../../../../database/prisma-repositories/prisma-seasons-repository";

export function makeCheckCurrentSeasonUseCase() {
  const seasonRepository = new PrismaSeasonsRepository();
  const playersRepository = new PrismaPlayersRepository();
  const playerSeasonPointsRepository = new PrismaPlayerSeasonPointsRepository();
  const playerTotalPointsRepository = new PrismaPlayerTotalPointsRepository();
  const applicationLogRepository = new PrismaApplicationLogRepository();
  const sut = new CheckCurrentSeasonUseCase(seasonRepository, playersRepository, playerSeasonPointsRepository, playerTotalPointsRepository, applicationLogRepository);
  return sut;
}