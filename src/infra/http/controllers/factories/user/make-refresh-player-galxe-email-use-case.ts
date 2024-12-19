import { RefreshPlayerGalxeEmailUseCase } from "../../../../../domain/user/application/use-cases/user/refresh-player-galxe-email-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaParametersRepository } from "../../../../database/prisma-repositories/prisma-parameters-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { IncredbullGalxeApiGateway } from "../../../../gateways/incredbull-galxe-api-gateway"

export function makeRefreshPlayerGalxeEmailUseCase() {
  const campaignGateway = new IncredbullGalxeApiGateway();
  const playersRepository = new PrismaPlayersRepository();
  const authPlayerProvider = new SupabaseAuthPlayerProvider();
  const parametersRepository = new PrismaParametersRepository();
  const sut = new RefreshPlayerGalxeEmailUseCase(campaignGateway, playersRepository, authPlayerProvider, parametersRepository);
  return sut;
} 