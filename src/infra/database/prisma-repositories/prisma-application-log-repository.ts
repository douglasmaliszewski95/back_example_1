import { ApplicationLogRepository, CreateApplicationLogDTO } from "../../../domain/season/application/repositories/application-log-repository";
import { prisma } from "../prisma";

export class PrismaApplicationLogRepository implements ApplicationLogRepository {

  async create(data: CreateApplicationLogDTO): Promise<void> {
    await prisma.applicationLogs.create({
      data
    });
  }
}