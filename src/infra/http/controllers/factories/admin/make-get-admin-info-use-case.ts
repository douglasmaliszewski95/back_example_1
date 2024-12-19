import { GetAdminInfoUseCase } from "../../../../../domain/user/application/use-cases/admin/get-admin-info-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";

export function makeGetAdminInfoUseCase() {
  const authProvider = new SupabaseAuthAdminProvider();
  const sut = new GetAdminInfoUseCase(authProvider);
  return sut;
}