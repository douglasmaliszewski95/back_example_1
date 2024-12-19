import { Announcement, AnnouncementProps } from "../../enterprise/entities/announcement";

interface UpdateAnnouncementData {
  tier?: number[];
  title?: string;
  message?: string;
  startDate?: Date;
  endDate?: Date;
  bannerUrl?: string;
  bannerExtension?: string;
}

interface ListAnnouncementsParams {
  page?: number;
  limit?: number;
  title?: string;
  tier?: string;
  startDate?: Date;
  endDate?: Date;
  effectiveDate?: Date;
}

interface ListAnnouncementsResponseDTO {
  total: number;
  list: Announcement[];
}

interface AttachBannerData {
  url: string;
  extension: string;
}

interface ToEntityWithIsRead extends AnnouncementProps {
  isRead: boolean
}

interface ListAnnouncementsForPlayerResponseDTO {
  total: number;
  list: ToEntityWithIsRead[];
}


export { UpdateAnnouncementData, ListAnnouncementsParams, ListAnnouncementsResponseDTO, AttachBannerData, ToEntityWithIsRead, ListAnnouncementsForPlayerResponseDTO };
