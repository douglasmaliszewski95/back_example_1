import { AuthAdminProvider } from "../../auth-provider/auth-admin-provider";

interface ListAdminsRequestDTO {
  page: number;
  limit: number;
  fullname?: string;
  status?: string;
  email?: string;
}

interface ListAdminsResponseDTO {
  page: number;
  total: number;
  limit: number;
  totalOfPages: number;
  list: {
    id: string;
    fullname?: string;
    status?: string;
    email?: string;
  }[];
}

export class ListAdminsUseCase {
  constructor(private authProvider: AuthAdminProvider) { }

  execute = async (data: ListAdminsRequestDTO): Promise<ListAdminsResponseDTO> => {
    const providerAdmins = await this.authProvider.listAdmins({
      page: data.page,
      limit: data.limit,
      email: data.email,
      fullname: data.fullname,
      status: data.status
    });

    return {
      page: data.page,
      total: providerAdmins.total,
      totalOfPages: providerAdmins.totalOfPages,
      limit: 10,
      list: providerAdmins.list
    }
  }
}

