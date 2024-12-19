interface Campaign {
  id?: number;
  name: string;
  description: string;
  externalId: string;
  active: boolean;
  startDate: Date;
  endDate: Date | null;
}

interface UpdateCampaignDTO {
  active: boolean;
}

export { Campaign, UpdateCampaignDTO };