import { randomInt } from "node:crypto";
import { AnnouncementsRepository } from "../../src/domain/announcement/application/repositories/announcements-repository";
import { Announcement } from "../../src/domain/announcement/enterprise/entities/announcement";
import {
  AttachBannerData,
  ListAnnouncementsForPlayerResponseDTO,
  ListAnnouncementsParams,
  ListAnnouncementsResponseDTO,
  ToEntityWithIsRead,
  UpdateAnnouncementData
} from "../../src/domain/announcement/application/repositories/announcements-repository.types";

export class AnnoucementsRepositoryInMemory implements AnnouncementsRepository {
  announcements: Announcement[] = [];

  async create(data: Announcement): Promise<Announcement> {
    data.id = randomInt(9999);
    await this.announcements.push(data);
    return data;
  }

  async update(id: number, data: UpdateAnnouncementData): Promise<Announcement> {
    const announcementIndex = this.announcements.findIndex(item => item.id === id);
    const announcement = this.announcements[announcementIndex];
    if (data.bannerExtension) announcement.bannerExtension = data.bannerExtension;
    if (data.bannerUrl) announcement.bannerUrl = data.bannerUrl;
    if (data.endDate) announcement.endDate = data.endDate;
    if (data.message) announcement.message = data.message;
    if (data.startDate) announcement.startDate = data.startDate;
    if (data.tier) announcement.tier = data.tier;
    if (data.title) announcement.title = data.title;

    return announcement;
  }

  async findById(id: number): Promise<Announcement | null> {
    const announcement = await this.announcements.find(announcement => announcement.id === id);
    if (!announcement) return null;
    return announcement;
  }

  async deleteById(id: number): Promise<void> {
    const announcementIndex = await this.announcements.findIndex(item => item.id === id);
    await this.announcements.splice(announcementIndex, 1);
  }

  async list(params: ListAnnouncementsParams): Promise<ListAnnouncementsResponseDTO> {
    const { page, limit, endDate, startDate, tier, title, effectiveDate } = params;

    const listTier = tier ? tier.split(",").map(tier => parseInt(tier)) : [];
    const filteredAdmins = this.announcements
      .filter(announcement => !title || announcement.title.includes(title))
      .filter(announcement => listTier.length === 0 || announcement.tier.some(t => listTier.includes(t)))
      .filter(announcement => !startDate || announcement.startDate >= startDate)
      .filter(announcement => !endDate || (announcement.endDate && announcement.endDate <= endDate))
      .filter(
        announcement =>
          !effectiveDate ||
          (announcement.startDate <= effectiveDate && announcement.endDate && announcement.endDate >= effectiveDate)
      );

    const totalRecords = filteredAdmins.length;
    const isPaginated = page && limit;
    const announcementsList = isPaginated ? filteredAdmins.slice((page - 1) * limit, page * limit) : filteredAdmins;

    return {
      total: totalRecords,
      list: announcementsList
    };
  }

  async listForPlayer(providerPlayerId: string, params?: ListAnnouncementsParams): Promise<ListAnnouncementsForPlayerResponseDTO> {
    const { page, limit, endDate, startDate, tier, title, effectiveDate } = params || {};

    const listTier = tier ? tier.split(",").map(tier => parseInt(tier)) : [];
    const filteredAdmins = this.announcements
      .filter(announcement => !title || announcement.title.includes(title))
      .filter(announcement => listTier.length === 0 || announcement.tier.some(t => listTier.includes(t)))
      .filter(announcement => !startDate || announcement.startDate >= startDate)
      .filter(announcement => !endDate || (announcement.endDate && announcement.endDate <= endDate))
      .filter(
        announcement =>
          !effectiveDate ||
          (announcement.startDate <= effectiveDate && announcement.endDate && announcement.endDate >= effectiveDate)
      );

    const totalRecords = filteredAdmins.length;
    const isPaginated = page && limit;
    const announcementsList = isPaginated ? filteredAdmins.slice((page - 1) * limit, page * limit) : filteredAdmins;

    const mappedAnnouncementsList = announcementsList.map((announcement) => {
      return {
        ...announcement,
        isRead: false
      }
    }) as ToEntityWithIsRead[];

    return {
      total: totalRecords,
      list: mappedAnnouncementsList
    };
  }

  async attachBanner(id: number, data: AttachBannerData): Promise<Announcement> {
    const announcementIndex = this.announcements.findIndex(item => item.id === id);
    const announcement = this.announcements[announcementIndex];
    if (data.url) announcement.bannerUrl = data.url;
    if (data.extension) announcement.bannerExtension = data.extension;
    return announcement;
  }

  async deleteBanner(id: number): Promise<void> {
    const announcementIndex = this.announcements.findIndex(item => item.id === id);
    const announcement = this.announcements[announcementIndex];
    announcement.bannerUrl = "";
    announcement.bannerExtension = "";
  }
}
