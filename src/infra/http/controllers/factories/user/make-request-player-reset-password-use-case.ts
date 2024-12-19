import { RequestPlayerResetPasswordUseCase } from "../../../../../domain/user/application/use-cases/user/request-player-reset-password-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";

export function makeRequestPlayerResetPasswordUseCase() {
  const gateway = new SupabaseAuthPlayerProvider();
  const sut = new RequestPlayerResetPasswordUseCase(gateway);
  return sut;
}