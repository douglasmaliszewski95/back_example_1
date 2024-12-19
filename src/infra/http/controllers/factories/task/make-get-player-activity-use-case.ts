import { GetPlayerActivityUseCase } from "../../../../../domain/tasks/application/use-cases/get-player-activity-use-case";
import { PrismaPlayerTotalPointsRepository } from "../../../../database/prisma-repositories/prisma-player-total-points-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PrismaSeasonsRepository } from "../../../../database/prisma-repositories/prisma-seasons-repository";
import { PrismaTasksRepository } from "../../../../database/prisma-repositories/prisma-tasks-repository";

export function makeGetPlayerActivityUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const tasksRepository = new PrismaTasksRepository();
  const seasonsRepository = new PrismaSeasonsRepository();
  const playerTotalPointsRepository = new PrismaPlayerTotalPointsRepository();
  const sut = new GetPlayerActivityUseCase(playersRepository, tasksRepository, seasonsRepository, playerTotalPointsRepository);
  return sut;
}