import { UploadAnnouncementBannerUseCase } from "../../../../../domain/announcement/application/use-cases/upload-announcement-banner-use-case";
import { PrismaAnnouncementsRepository } from "../../../../database/prisma-repositories/prisma-announcements-repository";
import { SupabaseFileStorage } from "../../../../storage/supabase-file-storage";

export function makeUploadAnnouncementBannerUseCase() {
  const repository = new PrismaAnnouncementsRepository();
  const storage = new SupabaseFileStorage();
  const sut = new UploadAnnouncementBannerUseCase(repository, storage);
  return sut;
} 