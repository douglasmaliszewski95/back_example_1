import { DeleteAnnouncementUseCase } from "../../../../../domain/announcement/application/use-cases/delete-announcement-use-case";
import { PrismaAnnouncementsRepository } from "../../../../database/prisma-repositories/prisma-announcements-repository";

export function makeDeleteAnnouncementUseCase() {
  const repository = new PrismaAnnouncementsRepository();
  const sut = new DeleteAnnouncementUseCase(repository);
  return sut;
} 