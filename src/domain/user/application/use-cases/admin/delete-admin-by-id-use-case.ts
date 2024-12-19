import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { AuthAdminProvider } from "../../auth-provider/auth-admin-provider";

export class DeleteAdminByIdUseCase {

  constructor(private authProvider: AuthAdminProvider) { }

  execute = async (id: string): Promise<void> => {
    const adminExists = await this.authProvider.getAdminById(id);
    if (!adminExists) throw new HttpException(HttpStatus.NOT_FOUND, "admin not found");
    this.authProvider.deleteAdmin(id);
  }
}