import { RefreshPlayerGalxeTelegramIdUseCase } from "../../../../../domain/user/application/use-cases/user/refresh-player-galxe-telegram-id-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { IncredbullGalxeApiGateway } from "../../../../gateways/incredbull-galxe-api-gateway"

export function makeRefreshPlayerGalxeTelegramIdUseCase() {
  const campaignGateway = new IncredbullGalxeApiGateway();
  const playersRepository = new PrismaPlayersRepository();
  const authPlayerProvider = new SupabaseAuthPlayerProvider();
  const sut = new RefreshPlayerGalxeTelegramIdUseCase(campaignGateway, playersRepository, authPlayerProvider);
  return sut;
} 