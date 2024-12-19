import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";

interface AuthenticatePlayerRequestDTO {
  email: string;
  password: string;
}

export class AuthenticatePlayerUseCase {

  constructor(private authProvider: AuthPlayerProvider) { }

  execute = async (data: AuthenticatePlayerRequestDTO) => {
    return await this.authProvider.signin({
      email: data.email,
      password: data.password
    });
  }
}