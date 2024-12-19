import { CampaignGateway } from "../gateway/campaign-gateway";

export class SigninWithGalxeUseCase {

  constructor(private campaignsGateway: CampaignGateway) { }

  execute = async (): Promise<{ url: string }> => {
    const url = await this.campaignsGateway.signinWthGalxe()
    return {
      url
    };
  }
}