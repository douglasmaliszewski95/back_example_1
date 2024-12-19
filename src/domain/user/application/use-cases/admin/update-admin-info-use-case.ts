import { AdminStatus } from "../../../../../core/enums/admin-status-enum";
import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { AuthAdminProvider } from "../../auth-provider/auth-admin-provider";

interface UpdateAdminInfoRequestDTO {
  fullname?: string;
  status?: AdminStatus;
}

interface UpdateAdminInfoResponseDTO {
  email: string | null;
  id: string;
  status: string | null;
  fullname: string | null;
}

export class UpdateAdminInfoUseCase {
  constructor(private authProvider: AuthAdminProvider) { }

  execute = async (id: string, data: UpdateAdminInfoRequestDTO): Promise<UpdateAdminInfoResponseDTO> => {
    const adminExists = await this.authProvider.getAdminById(id);
    if (!adminExists) throw new HttpException(HttpStatus.NOT_FOUND, "admin not found");
    const updatedUser = await this.authProvider.updateAdmin(id, data.fullname, data.status);

    return updatedUser;
  }
}