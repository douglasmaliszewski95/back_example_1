import { CampaignGateway } from "../../src/domain/campaign/application/gateway/campaign-gateway";
import { GetCampaignsAndQuestsResponse, GetGalxeUserDetailedInformationResponseDTO, GetUserInfoFromGalxeResponseDTO, SessionResponse } from "../../src/domain/campaign/application/gateway/campaign-gateway.types";
import { CampaignsAndQuestsMocks } from "../mocks/campaigns-and-quests-mock";

export class FakeCampaignsGateway implements CampaignGateway {
  async getCampaignsAndQuests(id?: string): Promise<GetCampaignsAndQuestsResponse> {
    const response = await CampaignsAndQuestsMocks.listCampaignsAndQuests();
    return response;
  }

  async signinWthGalxe(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async getGalxeUserInformation(code: string): Promise<GetUserInfoFromGalxeResponseDTO> {
    return {
      Avatar: code + "",
      DiscordUserID: "",
      Email: "",
      GalxeID: code,
      Name: "",
      TwitterUserID: "",
      TelegramUserID: "",
      RefreshTokenGalxe: "",
      Wallet: ""
    }
  }

  async getGalxeUserDetailedInformation(galxeId: string): Promise<GetGalxeUserDetailedInformationResponseDTO> {
    return {
      id: "galxe-id",
      username: "galxe-username",
      hasDiscord: true,
      discordUserID: "discord-id",
      hasTelegram: true,
      telegramUserID: "telegram-id",
      hasTwitter: true,
      twitterUserID: "twitter-id",
      email: "email"
    }
  }

  async getInfoGalxeUser(refreshToken: string): Promise<GetUserInfoFromGalxeResponseDTO> {
    return {
      Avatar: "",
      DiscordUserID: "",
      Email: "",
      GalxeID: "",
      Name: "",
      TwitterUserID: "",
      TelegramUserID: "",
      RefreshTokenGalxe: refreshToken,
      Wallet: ""
    }
  }

  async refreshSessionGalxe(refreshToken: string): Promise<SessionResponse> {
    return {
      access_token: "",
      expires_in: 0,
      refresh_token: "",
      scope: "",
      token_type: ""
    }
  }
}