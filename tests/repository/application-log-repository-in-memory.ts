import { ApplicationLogRepository, CreateApplicationLogDTO } from "../../src/domain/season/application/repositories/application-log-repository";

export class ApplicationLogRepositoryInMemory implements ApplicationLogRepository {
  logs: CreateApplicationLogDTO[] = [];

  async create(data: CreateApplicationLogDTO): Promise<void> {
    this.logs.push(data);
  }
}