import { UserIdentity } from "@supabase/supabase-js";
import { UserRole } from "../../core/enums/user-role-enum";
import { HttpException } from "../../core/errors/HttpException";
import { getEnumValueOrDefault, HttpStatus } from "../../core/errors/http-status";
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
} from "../../domain/user/application/auth-provider/auth-player-provider";
import { Player } from "../../domain/user/enterprise/entities/player";
import { env } from "../env";
import { supabaseAdminClient } from "../supabase/supabase";

export class SupabaseAuthPlayerProvider implements AuthPlayerProvider {
  async invitePlayer(email: string): Promise<string> {
    const { data: res, error } = await supabaseAdminClient.auth.admin.listUsers({
      page: 1,
      perPage: 500
    });

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    const userExists = res.users.find(u => u.email === email);
    if (userExists) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Email already taken");

    const { data: invitedUserdata, error: inviteError } = await supabaseAdminClient.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          role: UserRole.PLAYER
        },
        redirectTo: `${env.PLAYER_FRONTEND_BASEURL}/auth/reset-password`
      }
    );

    if (inviteError) {
      throw new HttpException(
        getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, inviteError.status),
        inviteError.message
      );
    }

    return invitedUserdata.user.id;
  }

  async signup(data: Player): Promise<SignupResponse> {
    const { data: userData, error } = await supabaseAdminClient.auth.signUp({
      email: data.email,
      password: data.password || "",
      options: {
        data: {
          role: UserRole.PLAYER
        }
      }
    });

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);
    if (!userData.user) throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "error creating user");
    const userId = userData.user.id;
    data.providerPlayerId = userId;

    return {
      data: data
    };
  }

  async getPlayer(token: string): Promise<GetPlayerResponseDTO> {
    const { data, error } = await supabaseAdminClient.auth.getUser(token);

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);
    const providers = data.user?.identities || [];

    return {
      providerPlayerId: data.user.id,
      email: data.user.email,
      provider: providers.length ? providers[0].provider : ''
    };
  }

  async getPlayerById(id: string): Promise<GetPlayerResponseDTO | null> {
    const { data, error } = await supabaseAdminClient.auth.admin.getUserById(id);

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);
    if (!data.user) return null;

    const providers = data.user?.identities || [];

    return {
      providerPlayerId: data.user.id,
      email: data.user.email,
      provider: providers[0].provider
    };
  }

  async listPlayers(page?: number): Promise<GetPlayerResponseDTO[]> {
    const { data, error } = await supabaseAdminClient.auth.admin.listUsers({
      page: page || 1,
      perPage: 500
    });
    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    const users = data.users
      .filter(player => player.user_metadata.role != UserRole.ADMIN)
      .map(user => {
        return {
          providerPlayerId: user.id,
          email: user.email,
          phoneNumber: user.phone
        };
      });

    return users;
  }

  async signin(data: SigninRequestDTO): Promise<SigninResponseDTO> {
    const { data: sessionData, error } = await supabaseAdminClient.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    return {
      expiresIn: sessionData.session?.expires_in,
      refreshToken: sessionData.session?.refresh_token,
      token: sessionData.session.access_token
    };
  }

  async signinDiscord(inviteCode?: string): Promise<SigninOAuth2ResponseDTO> {
    const { data, error } = await supabaseAdminClient.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: inviteCode ? env.PLAYER_FRONTEND_BASEURL + `/auth/callback?invitedBy=${inviteCode}` : env.PLAYER_FRONTEND_BASEURL + "/auth/callback"
      }
    });

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    return {
      url: data.url
    };
  }

  async signinTwitter(inviteCode?: string): Promise<SigninOAuth2ResponseDTO> {
    const { data, error } = await supabaseAdminClient.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: inviteCode ? env.PLAYER_FRONTEND_BASEURL + `/auth/callback?invitedBy=${inviteCode}` : env.PLAYER_FRONTEND_BASEURL + "/auth/callback"
      }
    });

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    return {
      url: data.url
    };
  }

  async refreshSession(refreshToken: string): Promise<RefreshSessionResponseDTO> {
    const { data, error } = await supabaseAdminClient.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);
    if (!data.session) throw new Error("Problem refreshing session");

    return {
      expiresIn: data.session.expires_in,
      refreshToken: data.session.refresh_token,
      token: data.session.access_token
    };
  }

  async resetPasswordRequest(email: string): Promise<void> {
    const { error } = await supabaseAdminClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.PLAYER_FRONTEND_BASEURL}/auth/reset-password`
    });

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);
  }

  async updatePlayerPassword(newPassword: string, accessToken: string, refreshToken: string): Promise<void> {
    await supabaseAdminClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    const { error } = await supabaseAdminClient.auth.updateUser({
      password: newPassword
    });

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);
  }

  async delete(providerPlayerId: string): Promise<void> {
    await supabaseAdminClient.auth.admin.deleteUser(providerPlayerId);
  }

  async loginAnonymous(): Promise<SignInAnonymouslyDTO> {
    const { data, error } = await supabaseAdminClient.auth.signInAnonymously();

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    return {
      user: {
        id: data.user?.id as string,
        email: data.user?.email as string,
        is_anonymous: data.user?.is_anonymous as boolean,
        username: ''
      },
      session: {
        access_token: data.session?.access_token as string,
        token_type: data.session?.token_type as string,
        expires_in: data.session?.expires_in as number,
        expires_at: data.session?.expires_at as number,
        refresh_token: data.session?.refresh_token as string,
      }
    }
  }

  async updateLoginAnonymous(data: SignUpAnonymousPlayerDTO): Promise<void> {
    // const { error } = await supabaseAdminClient.auth.admin.updateUserById(data.userId, { email: data.address, email_confirm: true });
    // if (error)
    //   throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    const { error: errorSession } = await supabaseAdminClient.auth.setSession({ access_token: data.accessToken, refresh_token: data.refreshToken });
    if (errorSession)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, errorSession.status), errorSession.message);

    const { error: errorUpdate } = await supabaseAdminClient.auth.updateUser({ email: data.address });
    if (errorUpdate)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, errorUpdate.status), errorUpdate.message);
  }

  async requestOTP(email: string): Promise<RequestOTP> {
    const { data, error } = await supabaseAdminClient.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false
      }
    });

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    return {
      data: {
        session: data.session,
        user: data.user,
        messageId: data.messageId as string
      },
      error
    }
  }

  async validateOTP(email: string, token: string): Promise<ValidateOTP> {
    const { data, error } = await supabaseAdminClient.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (error)
      throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    return {
      access_token: data.session?.access_token as string,
      token_type: data.session?.token_type as string,
      expires_in: data.session?.expires_in as number,
      refresh_token: data.session?.refresh_token as string
    }
  }
}
