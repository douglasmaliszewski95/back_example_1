import { ListAnnouncementVisualizationsUseCase } from "../../../../../domain/announcement/application/use-cases/list-announcement-visualizations-use-case";
import { PrismaAnnouncementVisualizationsRepository } from "../../../../database/prisma-repositories/prisma-announcement-visualizations-repository";
import { PrismaAnnouncementsRepository } from "../../../../database/prisma-repositories/prisma-announcements-repository";

export function makeListAnnouncementVisualizationsUseCase() {
  const announcementsRepository = new PrismaAnnouncementsRepository();
  const announcementVisualizationsRepository = new PrismaAnnouncementVisualizationsRepository();
  const sut = new ListAnnouncementVisualizationsUseCase(announcementsRepository, announcementVisualizationsRepository);
  return sut;
}