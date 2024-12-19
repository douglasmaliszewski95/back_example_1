import { UpdateAnnouncementUseCase } from "../../../../../domain/announcement/application/use-cases/update-announcement-use-case";
import { PrismaAnnouncementsRepository } from "../../../../database/prisma-repositories/prisma-announcements-repository";

export function makeUpdateAnnouncementUseCase() {
  const repository = new PrismaAnnouncementsRepository();
  const sut = new UpdateAnnouncementUseCase(repository);
  return sut;
} 