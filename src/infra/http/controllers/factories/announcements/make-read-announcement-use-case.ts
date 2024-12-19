import { ReadAnnouncementUseCase } from "../../../../../domain/announcement/application/use-cases/read-announcement-use-case"
import { PrismaAnnouncementVisualizationsRepository } from "../../../../database/prisma-repositories/prisma-announcement-visualizations-repository";
import { PrismaAnnouncementsRepository } from "../../../../database/prisma-repositories/prisma-announcements-repository";

export function makeReadAnnouncementUseCase() {
  const announcementsRepository = new PrismaAnnouncementsRepository();
  const announcementVisualizationsRepository = new PrismaAnnouncementVisualizationsRepository();
  const sut = new ReadAnnouncementUseCase(announcementsRepository, announcementVisualizationsRepository);
  return sut;
}