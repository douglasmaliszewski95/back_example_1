import { randomInt } from "node:crypto";
import { AnnouncementVisualizationsRepository } from "../../src/domain/announcement/application/repositories/announcement-visualizations-repository";
import { AnnouncementVisualization, CreateAnnoucementVisualizationData, ListParams, ListReturn } from "../../src/domain/announcement/application/repositories/announcement-visualizations-repository.types";

export class AnnouncementVisualizationsRepositoryInMemory implements AnnouncementVisualizationsRepository {
  visualizations: AnnouncementVisualization[] = [];

  async create(data: CreateAnnoucementVisualizationData): Promise<void> {
    this.visualizations.push({
      announcementId: data.announcementId,
      id: randomInt(999),
      isRead: true,
      readAt: new Date(),
      providerPlayerId: data.providerPlayerId
    });
  }

  async list(announcementId: number, params: ListParams): Promise<ListReturn> {

    const filteredVisualizations = this.visualizations.filter(visualization => visualization.announcementId === announcementId);
    const totalRecords = this.visualizations.length;
    const isPaginated = params.page && params.limit;
    const visualizations = isPaginated ? this.visualizations.slice((params.page - 1) * params.limit, params.page * params.limit) : filteredVisualizations;

    return {
      page: params.page,
      limit: params.limit,
      total: totalRecords,
      numberOfPages: filteredVisualizations.length / params.limit,
      list: visualizations,
    };
  }

  async findByAnnouncementIdAndProviderPlayerId(announcementId: number, providerPlayerId: string): Promise<AnnouncementVisualization | null> {
    const visualization = await this.visualizations.find(visualization => visualization.announcementId === announcementId && visualization.providerPlayerId === providerPlayerId);
    if (!visualization) return null;
    return visualization;
  }
}