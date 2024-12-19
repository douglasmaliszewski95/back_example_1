import { Campaign, UpdateCampaignDTO } from "./campaigns-repository.types";

export interface CampaignsRepository {
  create(data: Campaign): Promise<Campaign>;
  findByExternalId(externalId: string): Promise<null | Campaign>;
  update(id: number, data: UpdateCampaignDTO): Promise<Campaign>;
}