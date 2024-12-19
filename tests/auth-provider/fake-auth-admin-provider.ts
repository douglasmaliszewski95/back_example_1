import { User as SupabaseUser } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { HttpException } from "../../src/core/errors/HttpException";
import { HttpStatus } from "../../src/core/errors/http-status";
import { AuthAdminProvider, GetAdminResponseDTO, ListAdminsParams, ListAdminsResponseDTO, SignupResponseDTO, UpdateAdminInfoResponseDTO } from "../../src/domain/user/application/auth-provider/auth-admin-provider";
import { RefreshSessionResponseDTO, SigninRequestDTO, SigninResponseDTO } from "../../src/domain/user/application/auth-provider/auth-player-provider";
import { Admin } from "../../src/domain/user/enterprise/entities/admin";
import { UserRole } from "../../src/core/enums/user-role-enum";
import { AdminStatus } from "../../src/core/enums/admin-status-enum";

export class FakeAuthAdminProvider implements AuthAdminProvider {
  admins: SupabaseUser[] = [];

  async signup(data: Admin): Promise<SignupResponseDTO> {
    if (!data.email) {
      return {
        data,
        error: {
          code: "400",
          msg: "Invalid email",
          status: 400
        }
      }
    }

    const id = randomUUID();

    this.admins.push({
      email: data.email,
      aud: "",
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        role: UserRole.ADMIN,
        fullname: data.fullname,
        status: data.status
      },
      id: id,
    });

    data.id = id;

    return {
      data
    }
  }

  async getAdmin(token: string): Promise<GetAdminResponseDTO> {
    if (!token) throw new HttpException(HttpStatus.BAD_REQUEST, "Invalid token")

    const user = await this.admins.find(user => user.id === token);
    if (!user) throw new HttpException(HttpStatus.BAD_REQUEST, "User not found");

    return {
      id: user.id,
      email: user.email ?? "",
      fullname: user.user_metadata.fullname,
      status: ""
    }
  }

  async signin(data: SigninRequestDTO): Promise<SigninResponseDTO> {
    if (!data) throw new HttpException(HttpStatus.BAD_REQUEST, "Missing information");
    const admin = await this.admins.find(admin => {
      return admin.email === data.email
    })
    if (!admin) throw new HttpException(HttpStatus.BAD_REQUEST, "User not found");
    const role = admin.user_metadata.role === UserRole.ADMIN;
    const status = admin.user_metadata.status === AdminStatus.INACTIVE;
    if (!role || status) throw new HttpException(HttpStatus.UNAUTHORIZED, "Unauthorized");

    return {
      expiresIn: 1,
      refreshToken: admin.id.split("-")[4],
      token: admin.id
    }
  }

  async refreshSession(refreshToken: string): Promise<RefreshSessionResponseDTO> {
    if (!refreshToken) throw new HttpException(HttpStatus.BAD_REQUEST, "Missing information");
    const admin = await this.admins.find(admin => admin.id.split("-")[4] === refreshToken);
    if (!admin) throw new HttpException(HttpStatus.BAD_REQUEST, "User not found");

    return {
      expiresIn: 1,
      refreshToken: admin.id.split("-")[4],
      token: admin.id
    }
  }

  async getAdminById(id: string): Promise<GetAdminResponseDTO | null> {
    if (!id) throw new HttpException(HttpStatus.BAD_REQUEST, "Invalid id");
    const admin = await this.admins.find(admin => admin.id === id);
    if (!admin) throw new HttpException(HttpStatus.BAD_REQUEST, "User not found");

    return {
      id: admin.id,
      email: admin.email ?? "",
      fullname: admin.user_metadata.fullname,
      status: ""
    }
  }

  async listAdmins(params: ListAdminsParams): Promise<ListAdminsResponseDTO> {
    const { email, fullname, page, status, limit } = params;

    const listStatus = status ? status.split(",") : [];
    const filteredAdmins = this.admins
      .filter(admin => admin.user_metadata?.role === UserRole.ADMIN)
      .filter(admin => !email || admin.email?.includes(email))
      .filter(admin => !fullname || admin.user_metadata.fullname?.includes(fullname))
      .filter(admin => listStatus.length === 0 || listStatus.includes(admin.user_metadata.status ?? ""));

    const totalRecords = filteredAdmins.length;
    const adminsList = filteredAdmins.slice((page - 1) * limit, page * limit);
    const admins = adminsList.map(admin => {
      return {
        id: admin.id,
        email: admin.email ?? "",
        fullname: admin.user_metadata.fullname,
        status: admin.user_metadata.status
      }
    });

    return {
      total: totalRecords,
      totalOfPages: Math.ceil(totalRecords / limit),
      list: admins
    }
  }

  async resetPasswordRequest(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async updateAdminPassword(newPassword: string, accessToken: string, refreshToken: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async inviteAdmin(data: Admin): Promise<void> {
    this.admins.push({
      email: data.email,
      aud: "",
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        role: UserRole.ADMIN,
        fullname: data.fullname,
        status: data.status
      },
      id: randomUUID(),
    });
  }

  async updateAdmin(id: string, fullname?: string | undefined, status?: AdminStatus | undefined): Promise<UpdateAdminInfoResponseDTO> {
    const index = this.admins.findIndex((item) => item.id === id);
    if (fullname) this.admins[index].user_metadata.fullname = fullname;
    if (status) this.admins[index].user_metadata.status = status;
    const updatedAdmin = this.admins[index];

    return {
      email: updatedAdmin.email ?? null,
      fullname: updatedAdmin.user_metadata.fullname ?? null,
      id: updatedAdmin.id,
      status: updatedAdmin.user_metadata.status ?? null
    }
  }

  async deleteAdmin(id: string): Promise<void> {
    const adminIndex = await this.admins.findIndex((item) => item.id === id);
    await this.admins.splice(adminIndex, 1);
  }
}