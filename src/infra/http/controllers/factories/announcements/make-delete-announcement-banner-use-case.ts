import { DeleteAnnouncementBannerUseCase } from "../../../../../domain/announcement/application/use-cases/delete-announcement-banner-use-case";
import { PrismaAnnouncementsRepository } from "../../../../database/prisma-repositories/prisma-announcements-repository";
import { SupabaseFileStorage } from "../../../../storage/supabase-file-storage";

export function makeDeleteAnnouncementBannerUseCase() {
  const announcementsRepository = new PrismaAnnouncementsRepository();
  const fileStorage = new SupabaseFileStorage();
  const sut = new DeleteAnnouncementBannerUseCase(announcementsRepository, fileStorage);
  return sut;
}