import { CountQueryParams, ListSystemQueryParams, ReadSystemDTO, UpdateSystemDTO } from "./system-repository-types";
import { System } from "../../enterprise/entities/system";

export interface SystemRepository {
  create(data: System): Promise<void>;
  remove(id: number): Promise<void>;
  list(queryFilters: ListSystemQueryParams): Promise<ReadSystemDTO[]>;
  count(queryFilters: CountQueryParams): Promise<number>;
  update(data: UpdateSystemDTO): Promise<void>;
  getById(id: number): Promise<ReadSystemDTO | null>;
  findBySystemId(systemId: string): Promise<System | null>;
}
