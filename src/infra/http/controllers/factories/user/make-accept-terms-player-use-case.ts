import { AcceptTermsPlayerUseCase } from "../../../../../domain/user/application/use-cases/user/accept-terms-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { PrismaInvitedPlayersRepository } from "../../../../database/prisma-repositories/prisma-invited-players-repository";
import { PrismaParametersRepository } from "../../../../database/prisma-repositories/prisma-parameters-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { IncredbullGalxeApiGateway } from "../../../../gateways/incredbull-galxe-api-gateway";

export function makeAcceptTermsPlayerUseCase() {
  const campaignGateway = new IncredbullGalxeApiGateway();
  const gateway = new SupabaseAuthPlayerProvider();
  const parametersRepository = new PrismaParametersRepository();
  const playersRepository = new PrismaPlayersRepository();
  const invitedPlayersRepository = new PrismaInvitedPlayersRepository();
  const sut = new AcceptTermsPlayerUseCase(
    gateway,
    parametersRepository,
    campaignGateway,
    playersRepository,
    invitedPlayersRepository
  );
  return sut;
}
