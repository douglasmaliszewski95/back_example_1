import { HttpStatus } from "../../../../../core/errors/http-status";
import { HttpException } from "../../../../../core/errors/HttpException";
import { CaptchaApiGateway } from "../../../../../infra/gateways/captcha-api-gateway";

export class ValidateCaptchaUseCase {
  constructor(private captchaApiClient: CaptchaApiGateway) { }

  execute = async (tokenCaptcha: string): Promise<{success: boolean, errorCode: string}> => {
    const validateCaptcha = await this.captchaVerify(tokenCaptcha);
    return {
      success: validateCaptcha.success,
      errorCode: validateCaptcha.errorCode
    }
  }

  private captchaVerify = async (token: string): Promise<{success: boolean, errorCode: string}> => {
    if (!token) throw new HttpException(HttpStatus.UNAUTHORIZED, "You must insert a token for verify.");
    const response = await this.captchaApiClient.validateTokenCaptcha(token);
    if (!response.success) throw new HttpException(HttpStatus.UNAUTHORIZED, response["error-codes"][0]);
    return {
      success: response.success,
      errorCode: response["error-codes"][0]
    }
  }
}