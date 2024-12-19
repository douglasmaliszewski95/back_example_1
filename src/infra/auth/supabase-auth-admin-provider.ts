import { AdminStatus } from "../../core/enums/admin-status-enum";
import { UserRole } from "../../core/enums/user-role-enum";
import { HttpException } from "../../core/errors/HttpException";
import { getEnumValueOrDefault, HttpStatus } from "../../core/errors/http-status";
import { AuthAdminProvider, GetAdminResponseDTO, ListAdminsParams, ListAdminsResponseDTO, UpdateAdminInfoResponseDTO } from "../../domain/user/application/auth-provider/auth-admin-provider";
import { SigninRequestDTO, SigninResponseDTO, RefreshSessionResponseDTO } from "../../domain/user/application/auth-provider/auth-player-provider";
import { Admin } from "../../domain/user/enterprise/entities/admin";
import { env } from "../env";
import { supabaseAdminClient } from "../supabase/supabase";

export class SupabaseAuthAdminProvider implements AuthAdminProvider {

  async inviteAdmin(data: Admin): Promise<void> {
    const { data: res, error } = await supabaseAdminClient.auth.admin.listUsers({
      page: 1,
      perPage: 500
    });

    if (error) throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    const userExists = res.users.find(u => u.email === data.email);
    if (userExists) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Email already taken");

    await supabaseAdminClient.auth.admin.inviteUserByEmail(data.email, {
      data: {
        role: UserRole.ADMIN,
        fullname: data.fullname,
        status: data.status
      },
      redirectTo: `${env.ADMIN_FRONTEND_BASEURL}/auth/reset-password`
    });
  }

  async getAdmin(token: string): Promise<GetAdminResponseDTO | null> {
    const { data, error } = await supabaseAdminClient.auth.getUser(token);
    if (error) throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    return {
      id: data.user.id,
      email: data.user.email ?? "",
      fullname: data.user.user_metadata.fullname ?? "",
      status: ""
    }
  }

  async getAdminById(id: string): Promise<GetAdminResponseDTO | null> {
    const { data, error } = await supabaseAdminClient.auth.admin.getUserById(id);

    if (error) throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);
    if (!data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email ?? "",
      fullname: data.user.user_metadata.fullname ?? "",
      status: data.user.user_metadata.status ?? ""
    }
  }

  async listAdmins(params: ListAdminsParams): Promise<ListAdminsResponseDTO> {
    const { email, fullname, page, status, limit } = params;
    const { data, error } = await supabaseAdminClient.auth.admin.listUsers({
      page: 1,
      perPage: 500
    });

    if (error) throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    const listStatus = status ? status.split(",") : [];
    const orderedAdmins = data.users.sort((a, b) => {
      const nameA = a.user_metadata.fullname || "";
      const nameB = b.user_metadata.fullname || "";
      return nameA.localeCompare(nameB);
    });
    const filteredAdmins = orderedAdmins
      .filter(admin => admin.user_metadata?.role === UserRole.ADMIN)
      .filter(admin => !email || admin.email?.includes(email.toLowerCase()))
      .filter(admin => !fullname || admin.user_metadata?.fullname?.toLowerCase().includes(fullname.toLowerCase()))
      .filter(admin => listStatus.length === 0 || listStatus.includes(admin.user_metadata.status ?? ""));

    const totalRecordsFound = filteredAdmins.length;
    const pageRecords = filteredAdmins.slice((page - 1) * limit, page * limit);

    const admins = pageRecords.map(admin => {
      return {
        id: admin.id,
        email: admin.email ?? "",
        fullname: admin.user_metadata.fullname,
        status: admin.user_metadata.status
      };
    });

    return {
      total: totalRecordsFound,
      totalOfPages: Math.ceil(totalRecordsFound / limit),
      list: admins
    };
  }

  async signin(data: SigninRequestDTO): Promise<SigninResponseDTO> {
    const { data: sessionData, error } = await supabaseAdminClient.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (error) throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);
    const roleAdmin = sessionData.user.user_metadata.role === UserRole.ADMIN;
    const statusInactive = sessionData.user.user_metadata.status === AdminStatus.INACTIVE;
    if (!roleAdmin || statusInactive) throw new HttpException(HttpStatus.UNAUTHORIZED, "Unauthorized");

    return {
      expiresIn: sessionData.session?.expires_in,
      refreshToken: sessionData.session?.refresh_token,
      token: sessionData.session.access_token
    }
  }

  async refreshSession(refreshToken: string): Promise<RefreshSessionResponseDTO> {
    const { data, error } = await supabaseAdminClient.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);
    if (!data.session) throw new Error("Problem refreshing session");

    return {
      expiresIn: data.session.expires_in,
      refreshToken: data.session.refresh_token,
      token: data.session.access_token
    };
  }

  async resetPasswordRequest(email: string): Promise<void> {
    const { error } = await supabaseAdminClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.ADMIN_FRONTEND_BASEURL}/auth/reset-password`
    });

    if (error) throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);
  }

  async updateAdminPassword(newPassword: string, accessToken: string, refreshToken: string): Promise<void> {
    const { data } = await supabaseAdminClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })
    const { error } = await supabaseAdminClient.auth.updateUser({
      password: newPassword,
    });

    if (error) throw new HttpException(getEnumValueOrDefault(HttpStatus.INTERNAL_SERVER_ERROR, error.status), error.message);

    const statusPending = data.user?.user_metadata.status === AdminStatus.PENDING;
    if (statusPending) {
      await supabaseAdminClient.auth.updateUser({
        data: {
          status: AdminStatus.ACTIVE
        }
      })
    }
  }

  async updateAdmin(id: string, fullname?: string | undefined, status?: string | undefined): Promise<UpdateAdminInfoResponseDTO> {
    const { data } = await supabaseAdminClient.auth.admin.updateUserById(id, {
      user_metadata: {
        fullname: fullname,
        status: status
      }
    });

    return {
      email: data.user?.email ?? null,
      fullname: data.user?.user_metadata.fullname ?? null,
      id: data.user?.id ?? "",
      status: data.user?.user_metadata.status ?? null
    }
  }

  async deleteAdmin(id: string): Promise<void> {
    await supabaseAdminClient.auth.admin.deleteUser(id);
  }
}