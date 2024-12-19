import { FindAdminByIdUseCase } from "../../../../../domain/user/application/use-cases/admin/find-admin-by-id-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";

export function makeFindAdminByIdUseCase() {
  const gateway = new SupabaseAuthAdminProvider();
  const sut = new FindAdminByIdUseCase(gateway);
  return sut;
}