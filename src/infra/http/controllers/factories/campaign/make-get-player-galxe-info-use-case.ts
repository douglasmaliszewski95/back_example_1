import { GetPlayerGalxeInfoUseCase } from "../../../../../domain/campaign/application/use-cases/get-player-galxe-info-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { IncredbullGalxeApiGateway } from "../../../../gateways/incredbull-galxe-api-gateway"

export function makeGetPlayerGalxeInfoUseCase() {
  const campaignGateway = new IncredbullGalxeApiGateway();
  const playersRepository = new PrismaPlayersRepository();
  const authPlayerProvider = new SupabaseAuthPlayerProvider();
  const sut = new GetPlayerGalxeInfoUseCase(campaignGateway, playersRepository, authPlayerProvider);
  return sut;
}