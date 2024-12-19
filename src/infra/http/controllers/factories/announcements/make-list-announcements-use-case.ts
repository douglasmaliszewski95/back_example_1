import { ListAnnouncementsUseCase } from "../../../../../domain/announcement/application/use-cases/list-announcements-use-case";
import { PrismaAnnouncementsRepository } from "../../../../database/prisma-repositories/prisma-announcements-repository";

export function makeListAnnouncementsUseCase() {
  const repository = new PrismaAnnouncementsRepository();
  const sut = new ListAnnouncementsUseCase(repository);
  return sut;
} 