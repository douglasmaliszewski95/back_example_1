import { RequestAdminResetPasswordUseCase } from "../../../../../domain/user/application/use-cases/admin/request-admin-reset-password-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";

export function makeRequestAdminResetPasswordUseCase() {
  const gateway = new SupabaseAuthAdminProvider();
  const sut = new RequestAdminResetPasswordUseCase(gateway);
  return sut;
}