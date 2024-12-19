import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { AuthAdminProvider } from "../../auth-provider/auth-admin-provider";

interface RequestAdminResetPasswordRequestDTO {
  email: string;
}

export class RequestAdminResetPasswordUseCase {

  constructor(private authProvider: AuthAdminProvider) { }

  execute = async (data: RequestAdminResetPasswordRequestDTO) => {
    if (!data.email) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid email");
    return await this.authProvider.resetPasswordRequest(data.email);
  }
}