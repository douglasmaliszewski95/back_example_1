import { SignInWithDiscordUseCase } from "../../../../../domain/user/application/use-cases/user/sign-in-with-discord-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";

export function makeSignInWithDiscordUseCase() {
  const authProvider = new SupabaseAuthPlayerProvider();
  const sut = new SignInWithDiscordUseCase(authProvider);
  return sut;
} 