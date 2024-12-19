interface CreateAnnoucementVisualizationData {
  announcementId: number;
  providerPlayerId: string;
}

interface ListParams {
  page: number;
  limit: number;
}

interface AnnouncementVisualization {
  id: number;
  announcementId: number;
  providerPlayerId: string;
  isRead: boolean;
  readAt: Date;
}

interface ListReturn {
  page: number;
  limit: number;
  total: number;
  numberOfPages: number;
  list: AnnouncementVisualization[];
}

export { CreateAnnoucementVisualizationData, ListParams, ListReturn, AnnouncementVisualization };