import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { AnnouncementsRepository } from "../repositories/announcements-repository";
import { FileStorage } from "../storage/file-storage";

export class DeleteAnnouncementBannerUseCase {
  constructor(private announcementsRepository: AnnouncementsRepository, private fileStorage: FileStorage) { }

  execute = async (announcementId: number): Promise<void> => {
    const announcement = await this.announcementsRepository.findById(announcementId);
    if (!announcement) throw new HttpException(HttpStatus.NOT_FOUND, "Announcement not found");
    if (!announcement.bannerUrl) throw new HttpException(HttpStatus.NOT_FOUND, "Banner not found to delete");
    await this.announcementsRepository.deleteBanner(announcementId);
    await this.fileStorage.delete(announcement.bannerUrl);
  }
}