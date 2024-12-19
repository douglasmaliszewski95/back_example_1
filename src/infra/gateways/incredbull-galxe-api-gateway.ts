import { CampaignGateway } from "../../domain/campaign/application/gateway/campaign-gateway";
import { GetCampaignsAndQuestsResponse, GetGalxeUserDetailedInformationResponseDTO, GetUserInfoFromGalxeResponseDTO, SessionResponse } from "../../domain/campaign/application/gateway/campaign-gateway.types";
import { incredbullGalxeApiClient } from "../http/http-client/incredibull-galxe-api-client";

export class IncredbullGalxeApiGateway implements CampaignGateway {
  async getCampaignsAndQuests(id?: string): Promise<GetCampaignsAndQuestsResponse> {
    const url = id ? `/campaigns?id=${id}` : `/campaigns`;
    const { data } = await incredbullGalxeApiClient.get(url);
    return data as GetCampaignsAndQuestsResponse;
  }

  async refreshSessionGalxe(refreshToken: string): Promise<SessionResponse> {
    const { data } = await incredbullGalxeApiClient.post("/auth/refreshToken", {
      refreshToken
    });
    return data as SessionResponse;
  }

  async getGalxeUserInformation(code: string): Promise<GetUserInfoFromGalxeResponseDTO> {
    const { data } = await incredbullGalxeApiClient.post("/auth/info", {
      code
    });
    return data as GetUserInfoFromGalxeResponseDTO;
  }

  async getInfoGalxeUser(refreshToken: string): Promise<GetUserInfoFromGalxeResponseDTO> {
    const { data } = await incredbullGalxeApiClient.post("/auth/infoGalxeUser", {
      refreshToken
    });
    return data as GetUserInfoFromGalxeResponseDTO;
  }

  async signinWthGalxe(): Promise<string> {
    const { data } = await incredbullGalxeApiClient.get(`/auth/galxe`);
    return data.url;
  }

  async getGalxeUserDetailedInformation(galxeId: string): Promise<GetGalxeUserDetailedInformationResponseDTO> {
    const { data } = await incredbullGalxeApiClient.get(`/user/details/${galxeId}`);
    return data;
  }
}