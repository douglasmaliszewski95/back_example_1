import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { AnnouncementsRepository } from "../repositories/announcements-repository"

export class DeleteAnnouncementUseCase {
  constructor(private announcementsRepository: AnnouncementsRepository) { }

  execute = async (id: number): Promise<void> => {
    const announcementExists = await this.announcementsRepository.findById(id);
    if (!announcementExists) throw new HttpException(HttpStatus.NOT_FOUND, "Announcement not found");
    await this.announcementsRepository.deleteById(id);
  }
}