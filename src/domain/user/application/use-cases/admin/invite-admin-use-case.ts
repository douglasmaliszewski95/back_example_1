import { AdminStatus } from "../../../../../core/enums/admin-status-enum";
import { Admin } from "../../../enterprise/entities/admin";
import { AuthAdminProvider } from "../../auth-provider/auth-admin-provider";

export class InviteAdminUseCase {
  constructor(private authProvider: AuthAdminProvider) { }

  execute = async (email: string, fullname: string): Promise<void> => {
    const admin = Admin.create({
      email,
      fullname,
      status: AdminStatus.PENDING
    });

    return this.authProvider.inviteAdmin(admin);
  }
}