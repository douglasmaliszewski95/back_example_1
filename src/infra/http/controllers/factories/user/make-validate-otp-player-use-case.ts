import { ValidateOTPPlayerUseCase } from "../../../../../domain/user/application/use-cases/user/validate-otp-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";

export function makeValidateOTPPlayerUseCase() {
  const gateway = new SupabaseAuthPlayerProvider();
  const sut = new ValidateOTPPlayerUseCase(gateway);
  return sut;
}