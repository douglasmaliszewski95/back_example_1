import { InviteAdminUseCase } from "../../../../../domain/user/application/use-cases/admin/invite-admin-use-case";
import { SupabaseAuthAdminProvider } from "../../../../auth/supabase-auth-admin-provider";

export function makeInviteAdminUserUseCase() {
  const authProvider = new SupabaseAuthAdminProvider();
  const sut = new InviteAdminUseCase(authProvider);
  return sut;
}