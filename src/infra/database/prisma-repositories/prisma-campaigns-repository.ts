import { CampaignsRepository } from "../../../domain/campaign/application/repositories/campaigns-repository";
import { Campaign, UpdateCampaignDTO } from "../../../domain/campaign/application/repositories/campaigns-repository.types";
import { prisma } from "../prisma";

export class PrismaCampaignsRepository implements CampaignsRepository {

  async create(data: Campaign): Promise<Campaign> {
    const campaign = await prisma.campaigns.create({
      data
    });

    return campaign;
  }

  async findByExternalId(externalId: string): Promise<null | Campaign> {
    const campaign = await prisma.campaigns.findFirst({
      where: {
        externalId
      }
    });

    if (!campaign) return null;
    return campaign;
  }

  async update(id: number, data: UpdateCampaignDTO): Promise<Campaign> {
    const campaign = await prisma.campaigns.update({
      where: {
        id
      },
      data
    })

    return campaign;
  }
}