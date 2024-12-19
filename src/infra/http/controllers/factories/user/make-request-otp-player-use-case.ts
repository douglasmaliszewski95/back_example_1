import { RequestOTPPlayerUseCase } from "../../../../../domain/user/application/use-cases/user/request-otp-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";

export function makeRequestOTPPlayerUseCase() {
  const gateway = new SupabaseAuthPlayerProvider();
  const sut = new RequestOTPPlayerUseCase(gateway);
  return sut;
}