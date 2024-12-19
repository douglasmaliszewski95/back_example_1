import { HttpException } from "../../../../../core/errors/HttpException";
import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";

interface RefreshPlayerTokenRequestDTO {
  refreshToken: string;
}

export class RefreshPlayerTokenUseCase {
  constructor(private authProvider: AuthPlayerProvider) { }

  execute = async (data: RefreshPlayerTokenRequestDTO) => {
    const { refreshToken } = data;
    if (!refreshToken) throw new HttpException(401, "Invalid token");
    return await this.authProvider.refreshSession(refreshToken)
  }
}