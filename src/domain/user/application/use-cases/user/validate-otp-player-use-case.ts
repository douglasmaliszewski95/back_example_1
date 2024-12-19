import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";

export class ValidateOTPPlayerUseCase {
  constructor(
    private authProvider: AuthPlayerProvider,
  ) { }

  execute = async (email: string, token: string) => {    
    const validateOTP = await this.authProvider.validateOTP(email, token);

    return validateOTP;
  }
}