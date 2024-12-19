import { LoginAnonymousPlayerUseCase } from "../../../../../domain/user/application/use-cases/user/login-anonymous-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";
import { CaptchaApiGateway } from "../../../../gateways/captcha-api-gateway";

export function makeLoginAnonymousPlayerUseCase() {
  const authProvider = new SupabaseAuthPlayerProvider();
  const captchaGateway = new CaptchaApiGateway();
  const sut = new LoginAnonymousPlayerUseCase(authProvider, captchaGateway);
  return sut;
} 