import { Player } from "../../enterprise/entities/player";

export interface AuthPlayerProvider {
  invitePlayer(email: string): Promise<string>;
  signup(data: Player): Promise<SignupResponse>;
  getPlayer(token: string): Promise<GetPlayerResponseDTO | null>;
  getPlayerById(id: string): Promise<GetPlayerResponseDTO | null>;
  listPlayers(): Promise<GetPlayerResponseDTO[]>;
  signin(data: SigninRequestDTO): Promise<SigninResponseDTO>;
  signinDiscord(inviteCode?: string): Promise<SigninOAuth2ResponseDTO>;
  signinTwitter(inviteCode?: string): Promise<SigninOAuth2ResponseDTO>;
  refreshSession(refreshToken: string): Promise<RefreshSessionResponseDTO>;
  resetPasswordRequest(email: string): Promise<void>;
  updatePlayerPassword(newPassword: string, accessToken: string, refreshToken: string): Promise<void>;
  delete(providerPlayerId: string): Promise<void>;
  loginAnonymous(): Promise<SignInAnonymouslyDTO>;
  updateLoginAnonymous(data: SignUpAnonymousPlayerDTO): Promise<void>;
  requestOTP(email: string): Promise<RequestOTP>;
  validateOTP(email: string, token: string): Promise<ValidateOTP>;
}

export interface GetPlayerResponseDTO {
  providerPlayerId: string;
  email?: string;
  provider?: string;
}

export interface ListPlayersRequestParams {
  page: number;
  limit: number;
  username?: string;
  discordId?: string;
  twitterId?: string;
  email?: string;
}

export interface SignupResponse {
  data?: Player;
  error?: {
    status: number;
    msg: string;
    code: string;
  };
}

export interface SigninRequestDTO {
  email: string;
  password: string;
}

export interface SigninResponseDTO {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SigninOAuth2ResponseDTO {
  url: string;
}

export interface RefreshSessionResponseDTO {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignInAnonymouslyDTO {
  user: {
    id: string;
    email: string;
    is_anonymous: boolean;
    username: string;
  },
  session: {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: number;
    refresh_token: string;
  }
}

export interface SignUpAnonymousPlayerDTO {
  userId: string;
  accessToken: string;
  refreshToken: string;
  address: string;
}

export interface RequestOTP {
  data: {
    user: null;
    session: null;
    messageId: string | null;
  };
  error: string | null;
}

export interface ValidateOTP {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}
