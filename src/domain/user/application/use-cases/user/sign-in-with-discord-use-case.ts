import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";

export class SignInWithDiscordUseCase {
  constructor(private authProvider: AuthPlayerProvider) { }

  execute = async (inviteCode?: string) => {
    return this.authProvider.signinDiscord(inviteCode);
  }
}