import { randomInt } from "node:crypto";
import { CampaignsRepository } from "../../src/domain/campaign/application/repositories/campaigns-repository";
import { Campaign, UpdateCampaignDTO } from "../../src/domain/campaign/application/repositories/campaigns-repository.types";

export class CampaignsRepositoryInMemory implements CampaignsRepository {
  campaigns: Campaign[] = [];

  async create(data: Campaign): Promise<Campaign> {
    const newCampaign = {
      ...data,
      id: randomInt(999)
    }
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  async findByExternalId(externalId: string): Promise<null | Campaign> {
    const campaign = this.campaigns.find(campaign => campaign.externalId === externalId);
    if (!campaign) return null;
    return campaign;
  }

  async update(id: number, data: UpdateCampaignDTO): Promise<Campaign> {
    const campaignIndex = this.campaigns.findIndex(item => item.id === id);
    const campaign = this.campaigns[campaignIndex];
    if (data.active) campaign.active = data.active;

    return campaign;
  }
}