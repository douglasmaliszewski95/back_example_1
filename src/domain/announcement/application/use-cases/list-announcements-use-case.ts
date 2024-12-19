import { Announcement } from "../../enterprise/entities/announcement";
import { AnnouncementsRepository } from "../repositories/announcements-repository";

interface ListAnnouncementsRequestDTO {
  page: number;
  limit: number;
  title?: string;
  tier?: string;
  startDate?: Date;
  endDate?: Date;
}

interface ListAnnouncementsResponseDTO {
  page: number;
  total: number;
  limit: number;
  list: Announcement[];
}

export class ListAnnouncementsUseCase {
  constructor(private announcementsRepository: AnnouncementsRepository) {}

  execute = async (data: ListAnnouncementsRequestDTO): Promise<ListAnnouncementsResponseDTO> => {
    const announcementsList = await this.announcementsRepository.list(data);

    return {
      page: data.page,
      total: announcementsList.total,
      limit: data.limit,
      list: announcementsList.list
    };
  };
}
