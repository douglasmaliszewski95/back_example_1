import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { AnnouncementVisualizationsRepository } from "../repositories/announcement-visualizations-repository";
import { AnnouncementsRepository } from "../repositories/announcements-repository";

interface ReadAnnouncementRequestDTO {
  announcementId: number;
  providerPlayerId: string;
}

export class ReadAnnouncementUseCase {
  constructor(private announcementsRepository: AnnouncementsRepository, private announcementVisualizationsRepository: AnnouncementVisualizationsRepository) { }

  execute = async (data: ReadAnnouncementRequestDTO): Promise<void> => {
    const announcementExists = await this.announcementsRepository.findById(data.announcementId);
    if (!announcementExists) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "announcement not found");
    const visualizationExists = await this.announcementVisualizationsRepository.findByAnnouncementIdAndProviderPlayerId(data.announcementId, data.providerPlayerId);
    if (visualizationExists) return;
    await this.announcementVisualizationsRepository.create(data);
  }
}