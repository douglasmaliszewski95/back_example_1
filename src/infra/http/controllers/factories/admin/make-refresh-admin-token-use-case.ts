import { RefreshAdminTokenUseCase } from "../../../../../domain/user/application/use-cases/admin/refresh-admin-token-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";

export function makeRefreshAdminTokenUseCase() {
  const authProvider = new SupabaseAuthAdminProvider();
  const sut = new RefreshAdminTokenUseCase(authProvider);
  return sut;
}