import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { AuthAdminProvider } from "../../auth-provider/auth-admin-provider";

interface UpdateAdminPasswordRequestDTO {
  newPassword: string;
  accessToken?: string;
  refreshToken: string;
}

export class UpdateAdminPasswordUseCase {
  constructor(private authProvider: AuthAdminProvider) { }

  execute = async (data: UpdateAdminPasswordRequestDTO) => {
    if (!data.newPassword) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "password is required");
    if (!data.accessToken) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "update password invalid");
    if (!data.refreshToken) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "update password invalid");
    const currentToken = data.accessToken.split(" ");
    const token = currentToken[1];
    return await this.authProvider.updateAdminPassword(data.newPassword, token, data.refreshToken);
  }
}