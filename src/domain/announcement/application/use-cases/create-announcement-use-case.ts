import { Announcement } from "../../enterprise/entities/announcement";
import { AnnouncementsRepository } from "../repositories/announcements-repository";
import { VerifyAnnouncementDateBaseHandler } from "../validations/verify-announcement-date/verify-announcement-date-base-handler";

interface CreateAnnouncementRequestDTO {
  tier: number[];
  title: string;
  message: string;
  startDate: Date;
  endDate?: Date;
}

interface CreateAnnouncementResponseDTO {
  announcement: Announcement;
}

export class CreateAnnouncementUseCase {
  constructor(private announcementsRepository: AnnouncementsRepository) { }

  execute = async (data: CreateAnnouncementRequestDTO): Promise<CreateAnnouncementResponseDTO> => {
    const announcement = Announcement.create(data);

    const validateAnnounceDate = new VerifyAnnouncementDateBaseHandler();
    validateAnnounceDate.validate(data.startDate, data.endDate);

    const createdAnnouncement = await this.announcementsRepository.create(announcement);
    return {
      announcement: createdAnnouncement
    };
  };
}
