import { CaptchaGateway } from "../../domain/campaign/application/gateway/captcha-gateway";
import { CaptchaResponse } from "../../domain/campaign/application/gateway/captcha-gateway.types";
import { captchaApiClient } from "../http/http-client/captcha-api-client";
import { env } from "../env";

export class CaptchaApiGateway implements CaptchaGateway {
  async validateTokenCaptcha(token: string): Promise<CaptchaResponse> {
    const formData = new FormData();
    formData.append("secret", env.SECRET_KEY_CAPTCHA);
    formData.append("response", token);
    const response = await captchaApiClient.post("/v0/siteverify", formData);
    return response.data as unknown as CaptchaResponse;
  }
}