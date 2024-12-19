import { SignInWithTwitterUseCase } from "../../../../../domain/user/application/use-cases/user/sign-in-with-twitter-use-case";
import { SupabaseAuthPlayerProvider } from "../../../../auth/supabase-auth-player-provider";

export function makeSignInWithTwitterUseCase() {
  const authProvider = new SupabaseAuthPlayerProvider();
  const sut = new SignInWithTwitterUseCase(authProvider);
  return sut;
} 