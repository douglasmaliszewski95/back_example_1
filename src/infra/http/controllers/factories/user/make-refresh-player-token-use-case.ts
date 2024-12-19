import { RefreshPlayerTokenUseCase } from "../../../../../domain/user/application/use-cases/user/refresh-player-token-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";

export function makeRefreshPlayerTokenUseCase() {
  const authProvider = new SupabaseAuthPlayerProvider();
  const sut = new RefreshPlayerTokenUseCase(authProvider);
  return sut;
}