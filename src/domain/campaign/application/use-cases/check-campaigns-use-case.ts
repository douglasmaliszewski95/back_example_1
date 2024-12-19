import { LogOrigin, LogLevel } from "../../../../core/enums/log-enum";
import { env } from "../../../../infra/env";
import { ApplicationLogRepository } from "../../../season/application/repositories/application-log-repository";
import { CampaignGateway } from "../gateway/campaign-gateway";
import { Campaigns } from "../gateway/campaign-gateway.types";
import { CampaignsRepository } from "../repositories/campaigns-repository";

export class CheckCampaignsUseCase {
  constructor(
    private campaignGateway: CampaignGateway,
    private campaignsRepository: CampaignsRepository,
    private applicationLogRepository: ApplicationLogRepository
  ) { }

  execute = async () => {
    const space = await this.campaignGateway.getCampaignsAndQuests();
    if (!space) {
      await this.applicationLogRepository.create({
        content: "failed to get space info",
        level: LogLevel.ERROR,
        origin: LogOrigin.CHECK_CAMPAIGNS_CRON
      });
      return;
    }
    const campaigns = space.campaigns;

    await this.checkIfThereIsANewCampaign(campaigns);
    await this.checkIfThereIsACampaignEnding(campaigns)
  }

  checkIfThereIsANewCampaign = async (campaigns: Campaigns[]) => {
    await this.applicationLogRepository.create({ content: `starting to check if there is a new campaign`, level: LogLevel.INFO, origin: LogOrigin.CHECK_CAMPAIGNS_CRON });
    for (const campaign of campaigns) {
      const campaignExists = await this.campaignsRepository.findByExternalId(campaign.id);
      if (!campaignExists) {
        await this.applicationLogRepository.create({ content: `creating campaign ${campaign.id} `, level: LogLevel.INFO, origin: LogOrigin.CHECK_CAMPAIGNS_CRON });
        const isCampaignActive = campaign.endDate ? campaign.endDate < campaign.startDate : true;
        await this.campaignsRepository.create({
          externalId: campaign.id,
          active: isCampaignActive,
          description: campaign.name,
          name: campaign.name,
          startDate: campaign.startDate,
          endDate: campaign.endDate
        });

        // add new campaign event
      }
    }
    await this.applicationLogRepository.create({ content: `finishing to check if there is a new campaign`, level: LogLevel.INFO, origin: LogOrigin.CHECK_CAMPAIGNS_CRON });
  }

  checkIfThereIsACampaignEnding = async (campaigns: Campaigns[]) => {
    await this.applicationLogRepository.create({ content: `starting to check if there is a campaign ending`, level: LogLevel.INFO, origin: LogOrigin.CHECK_CAMPAIGNS_CRON });
    for (const campaign of campaigns) {
      if (!campaign.endDate) return;
      const currentDate = new Date();
      const timeDifference = campaign.endDate.getTime() - currentDate.getTime();
      if (timeDifference <= env.DEFAULT_TIME_TO_SEND_ENDING_CAMPAIGN_NOTIFICATION) {
        const campaignToInactivate = await this.campaignsRepository.findByExternalId(campaign.id);
        if (!campaignToInactivate || !campaignToInactivate.id) return;
        await this.campaignsRepository.update(campaignToInactivate?.id, {
          active: false
        });
        // add ending campaign event
      }
    }
    await this.applicationLogRepository.create({ content: `finishing to check if there is a campaign ending`, level: LogLevel.INFO, origin: LogOrigin.CHECK_CAMPAIGNS_CRON });
  }
}