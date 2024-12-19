interface GetCampaignsAndQuestsResponse {
  space: {
    id: string;
    name: string;
    links: string;
    status: string;
    followersCount: number;
    categories: string[];
  };
  campaigns: Campaigns[];
}

interface Campaigns {
  id: string;
  numberID: number;
  name: string;
  startDate: Date;
  endDate: Date | null;
  tasks: CampaignsTask[];
  rewards: RewardPoints[];
}

interface RewardPoints {
  rewardPoints: string,
  rewardType: string,
}

interface CampaignsTask {
  id: string;
  eligible: boolean;
  totalConditions: number;
  completedConditions: number;
  rewardPoints: RewardPoints[];
  rewardType: string;
  conditionToComplete: string;
  conditions: RewardCondition[];
  name?: string;
}

interface RewardCondition {
  eligible: boolean;
  id: string;
  name: string;
  credSource: string;
  credType: string;
  lastUpdate: number;
  type: string;
  referenceLink: string;
  taskLink: string;
  iconLink: string;
  description: string;
}

interface GetUserInfoFromGalxeResponseDTO {
  Avatar: string;
  DiscordUserID: string;
  Email: string;
  GalxeID: string;
  Name: string;
  TwitterUserID: string;
  TelegramUserID: string;
  Wallet: string;
  RefreshTokenGalxe: string;
}

interface GetGalxeUserDetailedInformationResponseDTO {
  id: string,
  username: string,
  hasDiscord: boolean,
  discordUserID: string,
  hasTelegram: boolean,
  telegramUserID: string,
  hasTwitter: boolean,
  twitterUserID: string,
  email: string
}

interface SessionResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export { Campaigns, CampaignsTask, GetCampaignsAndQuestsResponse, GetGalxeUserDetailedInformationResponseDTO, GetUserInfoFromGalxeResponseDTO, SessionResponse };

