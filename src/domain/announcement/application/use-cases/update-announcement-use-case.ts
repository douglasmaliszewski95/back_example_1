import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { Announcement } from "../../enterprise/entities/announcement";
import { AnnouncementsRepository } from "../repositories/announcements-repository";
import { VerifyAnnouncementDateBaseHandler } from "../validations/verify-announcement-date/verify-announcement-date-base-handler";

interface UpdateAnnouncementRequestDTO {
  tier?: number[];
  title?: string;
  message?: string;
  startDate?: Date;
  endDate?: Date;
}

interface UpdateAnnouncementResponseDTO {
  announcement: Announcement;
}

export class UpdateAnnouncementUseCase {
  constructor(private announcementsRepository: AnnouncementsRepository) { }

  execute = async (id: number, data: UpdateAnnouncementRequestDTO): Promise<UpdateAnnouncementResponseDTO> => {
    const announcementExists = await this.announcementsRepository.findById(id);
    if (!announcementExists) throw new HttpException(HttpStatus.NOT_FOUND, "Announcement not found");
    const validateAnnounceDate = new VerifyAnnouncementDateBaseHandler();
    validateAnnounceDate.validate(data.startDate, data.endDate);

    const updatedAnnouncement = await this.announcementsRepository.update(id, data);
    return {
      announcement: updatedAnnouncement
    };
  };
}
