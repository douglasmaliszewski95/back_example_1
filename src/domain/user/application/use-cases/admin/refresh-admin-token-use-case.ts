import { HttpException } from "../../../../../core/errors/HttpException";
import { AuthAdminProvider } from "../../auth-provider/auth-admin-provider";

interface RefreshAdminTokenRequestDTO {
  refreshToken: string;
}

export class RefreshAdminTokenUseCase {
  constructor(private authProvider: AuthAdminProvider) { }

  execute = async (data: RefreshAdminTokenRequestDTO) => {
    const { refreshToken } = data;
    if (!refreshToken) throw new HttpException(401, "Invalid token");
    return await this.authProvider.refreshSession(refreshToken)
  }
}