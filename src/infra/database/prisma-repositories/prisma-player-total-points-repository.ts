import { PlayerLeaderboardImage } from "../../../domain/season/application/helpers/player-leadearboard-image";
import { PlayerTotalPointsRepository } from "../../../domain/season/application/repositories/player-total-points-repository";
import { PaginatedTotalPointsLeaderboards, UpdatePlayerTotalPoints } from "../../../domain/season/application/repositories/player-total-points-repository.types";
import { PlayerTotalPoints } from "../../../domain/season/enterprise/entities/player-total-points";
import { PrismaPlayerTotalPointsMapper } from "../mappers/prisma-player-total-points-mapper";
import { prisma } from "../prisma";

export class PrismaPlayerTotalPointsRepository implements PlayerTotalPointsRepository {
  async create(data: PlayerTotalPoints): Promise<PlayerTotalPoints> {
    const totalPoints = await prisma.playerTotalPoints.create({
      data: PrismaPlayerTotalPointsMapper.toPrisma(data)
    });

    return PrismaPlayerTotalPointsMapper.toEntity(totalPoints);
  }

  async update(id: number, data: UpdatePlayerTotalPoints): Promise<void> {
    await prisma.playerTotalPoints.update({
      where: {
        id
      },
      data
    });
  }

  async findByProviderPlayerId(providerPlayerId: string): Promise<PlayerTotalPoints | null> {
    const playerTotalPoints = await prisma.playerTotalPoints.findFirst({
      where: {
        providerPlayerId
      }
    });

    if (!playerTotalPoints) return null;
    return PrismaPlayerTotalPointsMapper.toEntity(playerTotalPoints);
  }

  async getAllTimeLeaderboards(limit: number, page: number): Promise<PaginatedTotalPointsLeaderboards> {
    const [leaderboards, count] = await prisma.$transaction([
      prisma.playerTotalPoints.findMany({
        where: {
          player: {
            username: {
              not: null,
            }
          }
        },
        orderBy: {
          points: "desc",
        },
        select: {
          points: true,
          tier: true,
          progress: true,
          player: {
            select: {
              username: true,
              avatarUrl: true
            }
          }
        },
        take: limit,
        skip: ((page + 1) - 1) * limit
      }),
      prisma.playerTotalPoints.count({
        where: {
          player: {
            username: {
              not: null,
            }
          }
        },
        orderBy: {
          points: "desc",
        },
      })
    ])

    const alltimeLeaderboards = leaderboards.map(leaderboard => {
      return {
        points: leaderboard.points,
        tier: leaderboard.tier,
        progress: leaderboard.progress,
        player: {
          username: leaderboard.player.username,
          avatarUrl: PlayerLeaderboardImage.getPlayerImage(leaderboard.tier, leaderboard.player.avatarUrl),
        }
      }
    });

    return {
      currentPage: page,
      limit: limit,
      items: alltimeLeaderboards,
      nrOfPages: Math.ceil(count / limit),
      total: count
    };
  }

  async delete(providerPlayerId: string): Promise<void> {
    await prisma.playerTotalPoints.deleteMany({
      where: {
        providerPlayerId: providerPlayerId
      }
    })
  }
}