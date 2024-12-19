import { CaptchaResponse } from "./captcha-gateway.types";

export interface CaptchaGateway {
  validateTokenCaptcha(token: string): Promise<CaptchaResponse>;
}