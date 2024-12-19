import { SYSTEM_STATUS } from "../../enterprise/entities/system";

export interface ReadSystemDTO {
  id: number;
  name: string;
  description: string;
  systemId: string;
  status: SYSTEM_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateSystemDTO {
  id: number;
  name: string;
  description: string;
  status: SYSTEM_STATUS;
}

export interface ListSystemQueryParams {
  page: number;
  limit?: number;
  name?: string;
  description?: string;
  status?: SYSTEM_STATUS;
}

export type CountQueryParams = Omit<ListSystemQueryParams, "page" | "limit">;
