import { AuthAdminProvider } from "../../auth-provider/auth-admin-provider";

interface AuthenticateAdminRequestDTO {
  email: string;
  password: string;
}

export class AuthenticateAdminUseCase {

  constructor(private authProvider: AuthAdminProvider) { }

  execute = async (data: AuthenticateAdminRequestDTO) => {
    return await this.authProvider.signin({
      email: data.email,
      password: data.password
    });
  }
}