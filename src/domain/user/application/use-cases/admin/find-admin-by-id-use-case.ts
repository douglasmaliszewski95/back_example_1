import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { AuthAdminProvider } from "../../auth-provider/auth-admin-provider";

interface FindAdminByIdResponse {
  id: string;
  email: string;
  fullname: string;
  status: string;
}

export class FindAdminByIdUseCase {
  constructor(private authProvider: AuthAdminProvider) { }

  execute = async (id: string): Promise<FindAdminByIdResponse | null> => {
    const admin = await this.authProvider.getAdminById(id);
    if (!admin) throw new HttpException(HttpStatus.NOT_FOUND, "User not found");

    return {
      id: admin.id,
      email: admin.email ?? "",
      fullname: admin?.fullname ?? "",
      status: admin.status ?? "",
    };
  }
}