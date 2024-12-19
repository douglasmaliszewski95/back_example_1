import { GetCampaignsAndQuestsUseCase } from "../../../../domain/campaign/application/use-cases/get-campaigns-and-quests-use-case";
import { SupabaseAuthPlayerProvider } from "../../../auth/supabase-auth-player-provider";
import { PrismaPlayerSeasonPointsRepository } from "../../../database/prisma-repositories/prisma-player-season-points-repository";
import { PrismaPlayerTotalPointsRepository } from "../../../database/prisma-repositories/prisma-player-total-points-repository";
import { PrismaPlayersRepository } from "../../../database/prisma-repositories/prisma-players-repository";
import { PrismaSeasonsRepository } from "../../../database/prisma-repositories/prisma-seasons-repository";
import { PrismaTasksRepository } from "../../../database/prisma-repositories/prisma-tasks-repository";
import { IncredbullGalxeApiGateway } from "../../../gateways/incredbull-galxe-api-gateway";

export function makeGetCampaignsAndQuestsUseCase() {
  const gateway = new IncredbullGalxeApiGateway();
  const authPlayerProvider = new SupabaseAuthPlayerProvider();
  const playersRepository = new PrismaPlayersRepository();
  const tasksRepository = new PrismaTasksRepository();
  const seasonsRepository = new PrismaSeasonsRepository();
  const playerSeasonPointsRepository = new PrismaPlayerSeasonPointsRepository();
  const playerTotalPointsRepository = new PrismaPlayerTotalPointsRepository();
  const sut = new GetCampaignsAndQuestsUseCase(gateway, authPlayerProvider, playersRepository, tasksRepository, seasonsRepository, playerSeasonPointsRepository, playerTotalPointsRepository);
  return sut;
}