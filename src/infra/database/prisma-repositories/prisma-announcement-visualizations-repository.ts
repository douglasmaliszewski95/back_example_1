import { AnnouncementVisualizationsRepository } from "../../../domain/announcement/application/repositories/announcement-visualizations-repository";
import { AnnouncementVisualization, CreateAnnoucementVisualizationData, ListParams, ListReturn } from "../../../domain/announcement/application/repositories/announcement-visualizations-repository.types";
import { prisma } from "../prisma";

export class PrismaAnnouncementVisualizationsRepository implements AnnouncementVisualizationsRepository {
  async create(data: CreateAnnoucementVisualizationData): Promise<void> {
    await prisma.announcementVisualizations.create({
      data: {
        ...data,
        isRead: true,
        readAt: new Date()
      }
    });
  }

  async list(announcementId: number, params: ListParams): Promise<ListReturn> {
    const [visualizations, total] = await Promise.all([
      prisma.announcementVisualizations.findMany({
        where: {
          announcementId
        },
        orderBy: {
          readAt: 'desc'
        },
        take: params.limit,
        skip: params.page && params.limit ? (params.page - 1) * params.limit : undefined
      }),
      prisma.announcementVisualizations.count({
        where: {
          announcementId
        },
        orderBy: {
          readAt: 'desc'
        },
      })
    ])

    return {
      page: params.page,
      limit: params.limit,
      total: total,
      numberOfPages: total / params.limit,
      list: visualizations,
    };
  }

  async findByAnnouncementIdAndProviderPlayerId(announcementId: number, providerPlayerId: string): Promise<AnnouncementVisualization | null> {
    const visualization = await prisma.announcementVisualizations.findFirst({
      where: {
        announcementId,
        providerPlayerId
      }
    });

    if (!visualization) return null;

    return visualization;
  }
}