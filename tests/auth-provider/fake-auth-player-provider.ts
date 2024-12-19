import { User as SupabaseUser } from "@supabase/supabase-js";

import { randomUUID } from "node:crypto";
import { HttpException } from "../../src/core/errors/HttpException";
import { HttpStatus } from "../../src/core/errors/http-status";
import {
  AuthPlayerProvider,
  SignupResponse,
  SigninRequestDTO,
  SigninResponseDTO,
  SigninOAuth2ResponseDTO,
  RefreshSessionResponseDTO,
  GetPlayerResponseDTO,
  SignInAnonymouslyDTO,
  SignUpAnonymousPlayerDTO,
  RequestOTP,
  ValidateOTP
} from "../../src/domain/user/application/auth-provider/auth-player-provider";
import { Player } from "../../src/domain/user/enterprise/entities/player";

export class FakeAuthPlayerProvider implements AuthPlayerProvider {
  players: SupabaseUser[] = [];

  async invitePlayer(email: string): Promise<string> {
    if (this.players.find(player => player.email === email))
      throw new HttpException(HttpStatus.BAD_REQUEST, "User already exists");

    const id = randomUUID();

    this.players.push({
      email: email,
      aud: "",
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      id
    });

    return id;
  }

  async signup(data: Player): Promise<SignupResponse> {
    if (!data.email) {
      return {
        data,
        error: {
          code: "400",
          msg: "Invalid email",
          status: 400
        }
      };
    }

    this.players.push({
      email: data.email,
      aud: "",
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      id: data.providerPlayerId ?? randomUUID()
    });

    return {
      data
    };
  }

  async getPlayer(token: string): Promise<GetPlayerResponseDTO> {
    if (!token) throw new HttpException(HttpStatus.BAD_REQUEST, "Invalid token");

    const user = await this.players.find(user => user.id === token);
    if (!user) throw new HttpException(HttpStatus.BAD_REQUEST, "User not found");

    return {
      providerPlayerId: user.id,
      email: user.email
    };
  }

  async signin(data: SigninRequestDTO): Promise<SigninResponseDTO> {
    if (!data) throw new HttpException(HttpStatus.BAD_REQUEST, "Missing information");
    const user = await this.players.find(user => {
      return user.email === data.email;
    });
    if (!user) throw new HttpException(HttpStatus.BAD_REQUEST, "User not found");

    return {
      expiresIn: 1,
      refreshToken: user.id.split("-")[4],
      token: user.id
    };
  }

  async signinDiscord(): Promise<SigninOAuth2ResponseDTO> {
    throw new Error("Method not implemented.");
  }

  async signinTwitter(): Promise<SigninOAuth2ResponseDTO> {
    throw new Error("Method not implemented.");
  }

  async refreshSession(refreshToken: string): Promise<RefreshSessionResponseDTO> {
    if (!refreshToken) throw new HttpException(HttpStatus.BAD_REQUEST, "Missing information");
    const user = await this.players.find(user => user.id.split("-")[4] === refreshToken);
    if (!user) throw new HttpException(HttpStatus.BAD_REQUEST, "User not found");

    return {
      expiresIn: 1,
      refreshToken: user.id.split("-")[4],
      token: user.id
    };
  }

  async getPlayerById(id: string): Promise<GetPlayerResponseDTO | null> {
    if (!id) throw new HttpException(HttpStatus.BAD_REQUEST, "Invalid id");
    const user = await this.players.find(user => user.id === id);
    if (!user) throw new HttpException(HttpStatus.BAD_REQUEST, "User not found");

    return {
      providerPlayerId: user.id,
      email: user.email
    };
  }

  async listPlayers(): Promise<GetPlayerResponseDTO[]> {
    const listMapOfPlayers = await this.players.map(player => {
      return {
        providerPlayerId: player.id,
        email: player.email ?? ""
      };
    });

    return listMapOfPlayers;
  }

  async delete(providerPlayerId: string): Promise<void> {
    const announcementIndex = await this.players.findIndex(item => item.id === providerPlayerId);
    await this.players.splice(announcementIndex, 1);
  }

  async resetPasswordRequest(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async updatePlayerPassword(newPassword: string, accessToken: string, refreshToken: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async inviteAdmin(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async loginAnonymous(): Promise<SignInAnonymouslyDTO> {
    return {
      user: {
        id: "11f11598-7326-448b-ad9a-ba1ea32e34b3",
        email: "",
        is_anonymous: true,
        username: ""
      },
      session: {
        access_token: "token",
        token_type: "bearer",
        expires_in: 86400,
        expires_at: 1726343788,
        refresh_token: "token",
      }
    }
  }

  async updateLoginAnonymous(data: SignUpAnonymousPlayerDTO): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async requestOTP(email: string): Promise<RequestOTP> {
    throw new Error("Method not implemented.")
  }

  async validateOTP(email: string, token: string): Promise<ValidateOTP> {
    throw new Error("Method not implemented.")
  }
}
