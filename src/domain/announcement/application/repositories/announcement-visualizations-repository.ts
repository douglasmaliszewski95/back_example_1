import { AnnouncementVisualization, CreateAnnoucementVisualizationData, ListParams, ListReturn } from "./announcement-visualizations-repository.types";

export interface AnnouncementVisualizationsRepository {
  create(data: CreateAnnoucementVisualizationData): Promise<void>;
  list(announcementId: number, params: ListParams): Promise<ListReturn>;
  findByAnnouncementIdAndProviderPlayerId(announcementId: number, providerPlayerId: string): Promise<AnnouncementVisualization | null>
}

