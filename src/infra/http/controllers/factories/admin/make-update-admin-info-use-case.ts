import { UpdateAdminInfoUseCase } from "../../../../../domain/user/application/use-cases/admin/update-admin-info-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";

export function makeUpdateAdminInfoUseCase() {
  const authProvider = new SupabaseAuthAdminProvider();
  const sut = new UpdateAdminInfoUseCase(authProvider);
  return sut;
}