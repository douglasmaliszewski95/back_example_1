import { ValidateCaptchaUseCase } from "../../../../../domain/user/application/use-cases/user/validate-captcha-use-case";
import { CaptchaApiGateway } from "../../../../gateways/captcha-api-gateway";

export function makeValidateCaptchaUseCase() {
  const captchaGateway = new CaptchaApiGateway();
  const sut = new ValidateCaptchaUseCase(captchaGateway);
  return sut;
} 