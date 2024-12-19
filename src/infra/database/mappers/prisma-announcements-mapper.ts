import { Prisma, Announcement as PrismaAnnouncement } from "@prisma/client";
import { Announcement, AnnouncementProps } from "../../../domain/announcement/enterprise/entities/announcement";
import { ToEntityWithIsRead } from "../../../domain/announcement/application/repositories/announcements-repository.types";

interface AnnouncementWithIsRead {
  isRead: boolean;
  visualizations: {
    isRead: boolean;
  }[];
  id: number;
  title: string;
  message: string;
  startDate: Date | null;
  endDate: Date | null;
  bannerUrl: string | null;
  bannerExtension: string | null;
  createdAt: Date;
  updatedAt: Date;
  tier: number[];
}

export class PrismaAnnouncementsMapper {
  static toPrisma(announcement: Announcement): Prisma.AnnouncementUncheckedCreateInput {
    return {
      bannerExtension: announcement.bannerExtension,
      bannerUrl: announcement.bannerUrl,
      message: announcement.message,
      title: announcement.title,
      startDate: announcement.startDate,
      tier: announcement.tier,
      endDate: announcement.endDate,
      id: announcement.id
    }
  }

  static toEntity(announcement: PrismaAnnouncement): Announcement {
    return Announcement.create({
      bannerExtension: announcement.bannerExtension ?? "",
      bannerUrl: announcement.bannerUrl ?? "",
      message: announcement.message,
      title: announcement.title,
      startDate: announcement.startDate ?? new Date(),
      tier: announcement.tier,
      endDate: announcement.endDate ?? undefined,
      id: announcement.id
    })
  }



  static toEntityWithIsRead(announcement: AnnouncementWithIsRead): ToEntityWithIsRead {
    return {
      bannerExtension: announcement.bannerExtension ?? "",
      bannerUrl: announcement.bannerUrl ?? "",
      message: announcement.message,
      title: announcement.title,
      startDate: announcement.startDate ?? new Date(),
      tier: announcement.tier,
      endDate: announcement.endDate ?? undefined,
      isRead: announcement.isRead,
      id: announcement.id
    }
  }
}