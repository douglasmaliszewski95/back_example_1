import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { AuthAdminProvider } from "../../auth-provider/auth-admin-provider";

interface GetAdminInfoRequestDTO {
  token?: string;
}

interface GetAdminInfoResponseDTO {
  id: string;
  email: string;
  fullname: string;
  status: string;
}

export class GetAdminInfoUseCase {
  constructor(private authProvider: AuthAdminProvider) { }

  execute = async (data: GetAdminInfoRequestDTO): Promise<GetAdminInfoResponseDTO | null> => {
    if (!data.token) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
    const currentToken = data.token.split(" ");
    const token = currentToken[1];

    const admin = await this.authProvider.getAdmin(token);
    if (!admin) throw new HttpException(HttpStatus.NOT_FOUND, "User not found");

    return {
      id: admin?.id ?? "",
      email: admin?.email ?? "",
      fullname: admin?.fullname ?? "",
      status: admin?.status ?? "",
    };
  }
}