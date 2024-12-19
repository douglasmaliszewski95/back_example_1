import { CheckCampaignsUseCase } from "../../../../../domain/campaign/application/use-cases/check-campaigns-use-case";
import { PrismaApplicationLogRepository } from "../../../../database/prisma-repositories/prisma-application-log-repository";
import { PrismaCampaignsRepository } from "../../../../database/prisma-repositories/prisma-campaigns-repository";
import { IncredbullGalxeApiGateway } from "../../../../gateways/incredbull-galxe-api-gateway";

export function makeCheckCampaignsUseCase() {
  const campaingsGateway = new IncredbullGalxeApiGateway();
  const campaignsRepository = new PrismaCampaignsRepository();
  const applicationLogRepository = new PrismaApplicationLogRepository();
  const sut = new CheckCampaignsUseCase(campaingsGateway, campaignsRepository, applicationLogRepository);
  return sut;
}