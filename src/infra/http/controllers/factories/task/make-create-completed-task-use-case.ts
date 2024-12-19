import { CreateCompletedTaskUseCase } from "../../../../../domain/tasks/application/use-cases/create-completed-task-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayerSeasonPointsRepository } from "../../../../database/prisma-repositories/prisma-player-season-points-repository";
import { PrismaPlayerTotalPointsRepository } from "../../../../database/prisma-repositories/prisma-player-total-points-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PrismaSeasonsRepository } from "../../../../database/prisma-repositories/prisma-seasons-repository";
import { PrismaSystemRepository } from "../../../../database/prisma-repositories/prisma-system-repository";
import { PrismaTasksRepository } from "../../../../database/prisma-repositories/prisma-tasks-repository";

export function makeCreateCompletedTaskUseCase() {
  const tasksRepository = new PrismaTasksRepository();
  const playersRepository = new PrismaPlayersRepository();
  const systemsRepository = new PrismaSystemRepository();
  const seasonRepository = new PrismaSeasonsRepository();
  const playerSeasonPointsRepository = new PrismaPlayerSeasonPointsRepository();
  const playerTotalPointsRepository = new PrismaPlayerTotalPointsRepository();
  const sut = new CreateCompletedTaskUseCase(tasksRepository, playersRepository, systemsRepository, playerSeasonPointsRepository, playerTotalPointsRepository, seasonRepository);
  return sut;
} 