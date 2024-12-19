import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { AnnouncementVisualizationsRepository } from "../repositories/announcement-visualizations-repository";
import { ListReturn } from "../repositories/announcement-visualizations-repository.types";
import { AnnouncementsRepository } from "../repositories/announcements-repository";

interface ListAnnouncementVisualizationsParams {
  page: number;
  limit: number;
}

export class ListAnnouncementVisualizationsUseCase {
  constructor(private announcementsRepository: AnnouncementsRepository, private announcementVisualizationsRepository: AnnouncementVisualizationsRepository) { }

  execute = async (announcementId: number, params: ListAnnouncementVisualizationsParams): Promise<ListReturn> => {
    const announcementExists = await this.announcementsRepository.findById(announcementId);
    if (!announcementExists) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "announcement not found");
    return await this.announcementVisualizationsRepository.list(announcementId, params);
  }
}