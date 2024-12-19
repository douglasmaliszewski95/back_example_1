import { Admin } from "../../enterprise/entities/admin";
import { SigninRequestDTO, SigninResponseDTO, RefreshSessionResponseDTO } from "./auth-player-provider";

export interface AuthAdminProvider {
  deleteAdmin(id: string): Promise<void>;
  inviteAdmin(data: Admin): Promise<void>;
  getAdmin(token: string): Promise<GetAdminResponseDTO | null>;
  getAdminById(id: string): Promise<GetAdminResponseDTO | null>;
  listAdmins(params: ListAdminsParams): Promise<ListAdminsResponseDTO>;
  signin(data: SigninRequestDTO): Promise<SigninResponseDTO>
  refreshSession(refreshToken: string): Promise<RefreshSessionResponseDTO>;
  resetPasswordRequest(email: string): Promise<void>;
  updateAdminPassword(newPassword: string, accessToken: string, refreshToken: string): Promise<void>;
  updateAdmin(id: string, fullname?: string, status?: string): Promise<UpdateAdminInfoResponseDTO>;
}

export interface UpdateAdminInfoResponseDTO {
  email: string | null;
  id: string;
  status: string | null;
  fullname: string | null;
}

export interface GetAdminResponseDTO {
  id: string;
  email?: string;
  fullname?: string;
  status?: string;
}

export interface ListAdminsResponseDTO {
  total: number;
  totalOfPages: number;
  list: GetAdminResponseDTO[]
}

export interface SignupResponseDTO {
  data?: Admin;
  error?: {
    status: number;
    msg: string;
    code: string;
  }
}

export interface ListAdminsParams {
  page: number;
  limit: number;
  fullname?: string;
  status?: string;
  email?: string;
}