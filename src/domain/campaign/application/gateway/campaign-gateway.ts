import { GetCampaignsAndQuestsResponse, GetGalxeUserDetailedInformationResponseDTO, GetUserInfoFromGalxeResponseDTO, SessionResponse } from "./campaign-gateway.types";

export interface CampaignGateway {
  getCampaignsAndQuests(id?: string): Promise<GetCampaignsAndQuestsResponse>;
  signinWthGalxe(): Promise<string>;
  refreshSessionGalxe(refreshToken: string): Promise<SessionResponse>;
  getGalxeUserInformation(code: string): Promise<GetUserInfoFromGalxeResponseDTO>;
  getInfoGalxeUser(refreshToken: string): Promise<GetUserInfoFromGalxeResponseDTO>;
  getGalxeUserDetailedInformation(galxeId: string): Promise<GetGalxeUserDetailedInformationResponseDTO>;
}