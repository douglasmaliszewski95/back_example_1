import { AuthenticateAdminUseCase } from "../../../../../domain/user/application/use-cases/admin/authenticate-admin-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";

export function makeAuthenticateAdminUseCase() {
  const authProvider = new SupabaseAuthAdminProvider();
  const sut = new AuthenticateAdminUseCase(authProvider);
  return sut;
} 