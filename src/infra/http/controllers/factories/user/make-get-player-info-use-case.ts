import { GetPlayerInfoUseCase } from "../../../../../domain/user/application/use-cases/user/get-player-info-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayerSeasonPointsRepository } from "../../../../database/prisma-repositories/prisma-player-season-points-repository";
import { PrismaPlayerTotalPointsRepository } from "../../../../database/prisma-repositories/prisma-player-total-points-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PrismaSeasonsRepository } from "../../../../database/prisma-repositories/prisma-seasons-repository";
import { PrismaTasksRepository } from "../../../../database/prisma-repositories/prisma-tasks-repository";

export function makeGetPlayerInfoUseCase() {
  const authProvider = new SupabaseAuthPlayerProvider();
  const playersRepository = new PrismaPlayersRepository();
  const playerSeasonPointsRepository = new PrismaPlayerSeasonPointsRepository();
  const playerTotalPointsRepository = new PrismaPlayerTotalPointsRepository();
  const seasonsRepository = new PrismaSeasonsRepository();
  const tasksRepository = new PrismaTasksRepository();
  const sut = new GetPlayerInfoUseCase(authProvider, playersRepository, playerSeasonPointsRepository, playerTotalPointsRepository, seasonsRepository, tasksRepository);
  return sut;
}