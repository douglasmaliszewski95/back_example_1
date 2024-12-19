import { DeleteAdminByIdUseCase } from "../../../../../domain/user/application/use-cases/admin/delete-admin-by-id-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";

export function makeDeleteAdminByIdUseCase() {
  const authProvider = new SupabaseAuthAdminProvider();
  const sut = new DeleteAdminByIdUseCase(authProvider);
  return sut;
}