export interface ApplicationLogRepository {
  create(data: CreateApplicationLogDTO): Promise<void>;
}

export interface CreateApplicationLogDTO {
  content: string;
  level: string;
  origin?: string;
}