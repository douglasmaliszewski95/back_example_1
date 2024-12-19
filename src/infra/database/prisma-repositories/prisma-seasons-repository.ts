import { SeasonsRepository } from "../../../domain/season/application/repositories/seasons-repository";
import { Season } from "../../../domain/season/enterprise/entities/season";
import { PrismaSeasonsMapper } from "../mappers/prisma-seasons-mapper";
import { prisma } from "../prisma";

export class PrismaSeasonsRepository implements SeasonsRepository {
  async create(data: Season): Promise<Season> {
    const newSeason = await prisma.season.create({
      data: PrismaSeasonsMapper.toPrisma(data)
    });
    return PrismaSeasonsMapper.toEntity(newSeason);
  }

  async findActive(): Promise<Season | null> {
    const activeSeason = await prisma.season.findFirst({
      where: { active: true }
    });

    if (!activeSeason) return null;

    return PrismaSeasonsMapper.toEntity(activeSeason);
  }

  async findSeasonByCurrentDate(): Promise<Season | null> {
    const currentDate = new Date();
    const currentSeason = await prisma.season.findFirst({
      where: {
        startAt: { lte: currentDate },
        endAt: { gte: currentDate }
      }
    });
    if (!currentSeason) return null;

    return PrismaSeasonsMapper.toEntity(currentSeason);
  }

  async updateToInactive(seasonId: number): Promise<Season> {
    const updatedSeason = await prisma.season.update({
      where: { id: seasonId },
      data: { active: false }
    });
    return PrismaSeasonsMapper.toEntity(updatedSeason);
  }

  async updateToActive(seasonId: number): Promise<Season | null> {
    await prisma.season.updateMany({
      where: { active: true },
      data: { active: false }
    });

    const updatedSeason = await prisma.season.update({
      where: { id: seasonId },
      data: { active: true }
    });
    if (!updatedSeason) return null;

    return PrismaSeasonsMapper.toEntity(updatedSeason);
  }

  async findOverlappingSeason(startAt: Date, endAt: Date): Promise<Season | null> {
    const overlappingSeason = await prisma.season.findFirst({
      where: {
        OR: [
          {
            startAt: { lte: endAt },
            endAt: { gte: startAt },
          },
        ],
      },
    });

    if (!overlappingSeason) return null;

    return PrismaSeasonsMapper.toEntity(overlappingSeason);
  }
}