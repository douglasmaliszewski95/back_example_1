import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";

export class RequestOTPPlayerUseCase {
  constructor(
    private authProvider: AuthPlayerProvider,
  ) { }

  execute = async (email: string) => {    
    const requestOTP = await this.authProvider.requestOTP(email);

    return requestOTP;
  }
}