import { AuthenticatePlayerUseCase } from "../../../../../domain/user/application/use-cases/user/authenticate-player-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";

export function makeAuthenticatePlayerUseCase() {
  const authProvider = new SupabaseAuthPlayerProvider();
  const sut = new AuthenticatePlayerUseCase(authProvider);
  return sut;
} 