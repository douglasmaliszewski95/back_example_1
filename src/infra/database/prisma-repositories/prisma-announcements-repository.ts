import { AnnouncementsRepository } from "../../../domain/announcement/application/repositories/announcements-repository";
import {
  UpdateAnnouncementData,
  AttachBannerData,
  ListAnnouncementsParams,
  ListAnnouncementsResponseDTO,
  ListAnnouncementsForPlayerResponseDTO
} from "../../../domain/announcement/application/repositories/announcements-repository.types";
import { Announcement } from "../../../domain/announcement/enterprise/entities/announcement";
import { PrismaAnnouncementsMapper } from "../mappers/prisma-announcements-mapper";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

export class PrismaAnnouncementsRepository implements AnnouncementsRepository {
  async create(data: Announcement): Promise<Announcement> {
    const announcement = await prisma.announcement.create({
      data: PrismaAnnouncementsMapper.toPrisma(data)
    });

    return PrismaAnnouncementsMapper.toEntity(announcement);
  }

  async update(id: number, data: UpdateAnnouncementData): Promise<Announcement> {
    const announcement = await prisma.announcement.update({
      where: {
        id
      },
      data
    });

    return PrismaAnnouncementsMapper.toEntity(announcement);
  }

  async attachBanner(id: number, data: AttachBannerData): Promise<Announcement> {
    const announcement = await prisma.announcement.update({
      where: {
        id
      },
      data: {
        bannerExtension: data.extension,
        bannerUrl: data.url
      }
    });

    return PrismaAnnouncementsMapper.toEntity(announcement);
  }

  async findById(id: number): Promise<Announcement | null> {
    const announcement = await prisma.announcement.findFirst({
      where: {
        id
      }
    });

    if (!announcement) return null;

    return PrismaAnnouncementsMapper.toEntity(announcement);
  }

  async list(params: ListAnnouncementsParams = {}): Promise<ListAnnouncementsResponseDTO> {
    const filtersArray: Prisma.AnnouncementWhereInput[] = [];

    if (params.title) {
      filtersArray.push({ title: { contains: params.title, mode: "insensitive" } });
    }
    if (params.tier) {
      const parsedTiers = params.tier.split(",").map(tier => parseInt(tier));
      filtersArray.push({ tier: { hasSome: parsedTiers } });
    }
    if (params.startDate) {
      filtersArray.push({ startDate: { gte: params.startDate } });
    }
    if (params.endDate) {
      filtersArray.push({ endDate: { lte: params.endDate } });
    }
    if (params.effectiveDate) {
      filtersArray.push({
        AND: [
          { startDate: { lte: params.effectiveDate } },
          {
            OR: [{ endDate: { gte: params.effectiveDate } }, { endDate: null }]
          }
        ]
      });
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where: {
          AND: filtersArray
        },
        orderBy: {
          startDate: "desc"
        },
        take: params.limit,
        skip: params.page && params.limit ? (params.page - 1) * params.limit : undefined
      }),
      prisma.announcement.count({
        where: {
          AND: filtersArray
        }
      })
    ]);

    return {
      list: announcements.map(PrismaAnnouncementsMapper.toEntity),
      total: total
    };
  }

  async deleteById(id: number): Promise<void> {
    await prisma.announcement.delete({
      where: {
        id
      }
    });
  }

  async listForPlayer(providerPlayerId: string, params?: ListAnnouncementsParams): Promise<ListAnnouncementsForPlayerResponseDTO> {
    const filtersArray: Prisma.AnnouncementWhereInput[] = [];

    if (params && params.tier) {
      const parsedTiers = params.tier.split(",").map(tier => parseInt(tier));
      filtersArray.push({ tier: { hasSome: parsedTiers } });
    }

    if (params && params.effectiveDate) {
      filtersArray.push({
        AND: [
          { startDate: { lte: params.effectiveDate } },
          {
            OR: [{ endDate: { gte: params.effectiveDate } }, { endDate: null }]
          }
        ]
      });
    }

    const [announcements, total] = await prisma.$transaction([
      prisma.announcement.findMany({
        where: {
          AND: filtersArray
        },
        orderBy: {
          startDate: "desc"
        },
        take: params?.limit,
        skip: params?.page && params.limit ? (params.page - 1) * params.limit : undefined,
        include: {
          visualizations: {
            where: {
              providerPlayerId: providerPlayerId
            },
            select: {
              isRead: true
            }
          }
        }
      }),
      prisma.announcement.count({
        where: {
          AND: filtersArray
        }
      })
    ]);

    const formattedAnnouncements = announcements.map(announcement => {
      return {
        ...announcement,
        isRead: announcement.visualizations.length > 0 ? announcement.visualizations[0].isRead : false
      }
    });

    return {
      list: formattedAnnouncements.map(PrismaAnnouncementsMapper.toEntityWithIsRead),
      total: total
    };
  }

  async deleteBanner(id: number): Promise<void> {
    await prisma.announcement.update({
      where: {
        id
      },
      data: {
        bannerExtension: null,
        bannerUrl: null
      }
    })
  }
}
