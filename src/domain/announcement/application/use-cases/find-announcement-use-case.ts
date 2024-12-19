import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { Announcement } from "../../enterprise/entities/announcement";
import { AnnouncementsRepository } from "../repositories/announcements-repository";

export class FindAnnouncementUseCase {

  constructor(private announcementsRepository: AnnouncementsRepository) { }

  execute = async (id: number): Promise<Announcement> => {
    const announcement = await this.announcementsRepository.findById(id);

    if (!announcement) throw new HttpException(HttpStatus.NOT_FOUND, "No announcement found");

    return announcement;
  }
}