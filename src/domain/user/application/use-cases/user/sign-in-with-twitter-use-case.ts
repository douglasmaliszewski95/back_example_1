import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";

export class SignInWithTwitterUseCase {
  constructor(private authProvider: AuthPlayerProvider) { }

  execute = async (inviteCode?: string) => {
    return this.authProvider.signinTwitter(inviteCode);
  }
}