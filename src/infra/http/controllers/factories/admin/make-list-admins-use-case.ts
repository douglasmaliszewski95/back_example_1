import { ListAdminsUseCase } from "../../../../../domain/user/application/use-cases/admin/list-admins-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";

export function makeListAdminsUseCase() {
  const gateway = new SupabaseAuthAdminProvider();
  const sut = new ListAdminsUseCase(gateway);
  return sut;
}