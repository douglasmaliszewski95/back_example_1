import { UpdateAdminPasswordUseCase } from "../../../../../domain/user/application/use-cases/admin/update-admin-password-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";

export function makeUpdateAdminPasswordUseCase() {
  const gateway = new SupabaseAuthAdminProvider();
  const sut = new UpdateAdminPasswordUseCase(gateway);
  return sut;
}