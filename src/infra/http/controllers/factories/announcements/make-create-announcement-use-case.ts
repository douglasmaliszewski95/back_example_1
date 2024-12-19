import { CreateAnnouncementUseCase } from "../../../../../domain/announcement/application/use-cases/create-announcement-use-case";
import { PrismaAnnouncementsRepository } from "../../../../database/prisma-repositories/prisma-announcements-repository";

export function makeCreateAnnouncementUseCase() {
  const repository = new PrismaAnnouncementsRepository();
  const sut = new CreateAnnouncementUseCase(repository);
  return sut;
} 