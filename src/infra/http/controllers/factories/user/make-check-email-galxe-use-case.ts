import { CheckEmailGalxeUseCase } from "../../../../../domain/parameters/application/use-cases/check-email-galxe-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaApplicationLogRepository } from "../../../../database/prisma-repositories/prisma-application-log-repository";
import { PrismaParametersRepository } from "../../../../database/prisma-repositories/prisma-parameters-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { IncredbullGalxeApiGateway } from "../../../../gateways/incredbull-galxe-api-gateway"

export function makeCheckEmailGalxeUseCase() {
  const campaignGateway = new IncredbullGalxeApiGateway();
  const playersRepository = new PrismaPlayersRepository();
  const authPlayerProvider = new SupabaseAuthPlayerProvider();
  const parametersRepository = new PrismaParametersRepository();
  const applicationLogRepository = new PrismaApplicationLogRepository();
  const sut = new CheckEmailGalxeUseCase(campaignGateway, playersRepository, authPlayerProvider, parametersRepository, applicationLogRepository);
  return sut;
} 