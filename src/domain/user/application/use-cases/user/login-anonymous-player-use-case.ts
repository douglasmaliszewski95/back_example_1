import { HttpStatus } from "../../../../../core/errors/http-status";
import { HttpException } from "../../../../../core/errors/HttpException";
import { CaptchaApiGateway } from "../../../../../infra/gateways/captcha-api-gateway";
import { AuthPlayerProvider, SignInAnonymouslyDTO } from "../../auth-provider/auth-player-provider";

export class LoginAnonymousPlayerUseCase {

  constructor(private authPlayerProvider: AuthPlayerProvider, private captchaApiClient: CaptchaApiGateway) { }

  execute = async (tokenCaptcha: string): Promise<SignInAnonymouslyDTO> => {
    const validateCaptcha = await this.captchaVerify(tokenCaptcha);
    if (!validateCaptcha) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token or secret key.");
    const responseLogin = await this.authPlayerProvider.loginAnonymous();
    const login = await this.generateRandomUsername(responseLogin);
    return login
  }

  private captchaVerify = async (token: string): Promise<boolean> => {
    if (!token) throw new HttpException(HttpStatus.UNAUTHORIZED, "You must insert a token for verify.");
    const response = await this.captchaApiClient.validateTokenCaptcha(token);
    if (!response.success) throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, response["error-codes"][0]);
    return response.success;
  }

  private generateRandomUsername = async (login: SignInAnonymouslyDTO): Promise<SignInAnonymouslyDTO> => {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    const randomUsername = `Anonymous_${randomNumber}`;
    return {
      user: {
        id: login.user.id as string,
        email: login.user.email as string,
        is_anonymous: login.user.is_anonymous as boolean,
        username: randomUsername
      },
      session: {
        access_token: login.session.access_token as string,
        token_type: login.session.token_type as string,
        expires_in: login.session.expires_in as number,
        expires_at: login.session.expires_at as number,
        refresh_token: login.session.refresh_token as string,
      }
    }
  }
}