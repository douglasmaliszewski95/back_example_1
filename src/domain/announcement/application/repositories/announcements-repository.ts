import { Announcement } from "../../enterprise/entities/announcement";
import {
  AttachBannerData,
  ListAnnouncementsForPlayerResponseDTO,
  ListAnnouncementsParams,
  ListAnnouncementsResponseDTO,
  UpdateAnnouncementData
} from "./announcements-repository.types";

export interface AnnouncementsRepository {
  create(data: Announcement): Promise<Announcement>;
  update(id: number, data: UpdateAnnouncementData): Promise<Announcement>;
  attachBanner(id: number, data: AttachBannerData): Promise<Announcement>;
  deleteBanner(id: number): Promise<void>;
  findById(id: number): Promise<Announcement | null>;
  list(params?: ListAnnouncementsParams): Promise<ListAnnouncementsResponseDTO>;
  listForPlayer(providerPlayerId: string, params?: ListAnnouncementsParams): Promise<ListAnnouncementsForPlayerResponseDTO>
  deleteById(id: number): Promise<void>;
}
