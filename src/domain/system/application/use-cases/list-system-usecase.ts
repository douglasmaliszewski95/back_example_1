import { SystemRepository } from "../repositories/system-repository";
import { ListSystemQueryParams, ReadSystemDTO } from "../repositories/system-repository-types";

export interface ListSystemPaginatedResponse {
  page: number;
  total: number;
  limit: number;
  list: ReadSystemDTO[];
}

export class ListSystemUseCase {
  constructor(private systemRepository: SystemRepository) {}

  async execute(queryParams: ListSystemQueryParams): Promise<ListSystemPaginatedResponse> {
    const paginatedResponse = await this.systemRepository.list(queryParams);
    const count = await this.systemRepository.count(queryParams);

    return {
      page: queryParams.page,
      total: count,
      limit: queryParams.limit || 10,
      list: paginatedResponse
    };
  }
}
