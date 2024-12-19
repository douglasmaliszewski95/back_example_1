import { FindAnnouncementUseCase } from "../../../../../domain/announcement/application/use-cases/find-announcement-use-case";
import { PrismaAnnouncementsRepository } from "../../../../database/prisma-repositories/prisma-announcements-repository";

export function makeFindAnnouncementUseCase() {
  const repository = new PrismaAnnouncementsRepository();
  const sut = new FindAnnouncementUseCase(repository);
  return sut;
} 