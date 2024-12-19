import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { Announcement } from "../../enterprise/entities/announcement";
import { AnnouncementsRepository } from "../repositories/announcements-repository";
import { FileStorage } from "../storage/file-storage";
import sizeOf from 'image-size';

interface UploadAnnouncementBannerRequestDTO {
  fileName: string;
  fileType: string;
  buffer: Buffer;
}

interface UploadAnnouncementBannerResponseDTO {
  announcement: Announcement
}

export class UploadAnnouncementBannerUseCase {
  constructor(private announcementsRepository: AnnouncementsRepository, private fileStorage: FileStorage) { }

  execute = async (id: number, data: UploadAnnouncementBannerRequestDTO): Promise<UploadAnnouncementBannerResponseDTO> => {
    if (!/^(image\/(jpeg|png|jpg))$/.test(data.fileType)) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid file type");
    const dimensions = sizeOf(data.buffer);
    if (dimensions.width && dimensions.width > 120 && dimensions.height && dimensions.height > 120) throw new HttpException(HttpStatus.NOT_ACCEPTABLE, "invalid image dimensions");

    const announcement = await this.announcementsRepository.findById(id);
    if (!announcement) throw new HttpException(HttpStatus.NOT_FOUND, "Announcement not found");
    const { url } = await this.fileStorage.upload({
      body: data.buffer,
      fileName: data.fileName,
      fileType: data.fileType
    });

    if (!url) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Failed to upload banner");
    const announcementWithBanner = await this.announcementsRepository.attachBanner(id, {
      extension: data.fileType,
      url: url
    });
    if (announcement.bannerUrl) await this.fileStorage.delete(announcement.bannerUrl);

    return {
      announcement: announcementWithBanner
    };
  }
}