import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";

interface RequestPlayerResetPasswordRequestDTO {
  email: string;
}

export class RequestPlayerResetPasswordUseCase {

  constructor(private authProvider: AuthPlayerProvider) { }

  execute = async (data: RequestPlayerResetPasswordRequestDTO) => {
    if (!data.email) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid email");
    return await this.authProvider.resetPasswordRequest(data.email);
  }
}