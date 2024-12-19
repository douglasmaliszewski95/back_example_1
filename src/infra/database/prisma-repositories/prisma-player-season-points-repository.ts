import { PlayerLeaderboardImage } from "../../../domain/season/application/helpers/player-leadearboard-image";
import { PlayerSeasonPointsRepository } from "../../../domain/season/application/repositories/player-season-points-repository";
import { PaginatedSeasonLeaderboards, UpdatePlayerSeasonPointsRequest } from "../../../domain/season/application/repositories/player-season-points-repository.types";
import { PlayerSeasonPoints } from "../../../domain/season/enterprise/entities/player-season-points";
import { PrismaPlayerSeasonPointsMapper } from "../mappers/prisma-player-season-points-mapper";
import { prisma } from "../prisma";

export class PrismaPlayerSeasonPointsRepository implements PlayerSeasonPointsRepository {
  async create(data: PlayerSeasonPoints): Promise<PlayerSeasonPoints> {
    const seasonPoints = await prisma.playerSeasonPoints.create({
      data: PrismaPlayerSeasonPointsMapper.toPrisma(data)
    });

    return PrismaPlayerSeasonPointsMapper.toEntity(seasonPoints);
  }

  async getDescendingPlayersPointsForSeason(seasonId: number): Promise<PlayerSeasonPoints[]> {
    const playersSeasonPoints = await prisma.playerSeasonPoints.findMany({
      where: {
        seasonId,
        player: {
          status: {
            not: "BANNED"
          }
        }
      },
      orderBy: {
        points: "desc"
      }
    });

    return playersSeasonPoints.map(PrismaPlayerSeasonPointsMapper.toEntity);
  }

  async updatePlayerPointsRegister(id: number, data: UpdatePlayerSeasonPointsRequest): Promise<void> {
    await prisma.playerSeasonPoints.update({
      where: {
        id
      },
      data: {
        tier: data.newTier,
        points: data.points,
        progress: data.progress,
        lastTier: data.lastTier
      }
    });
  }

  async findBySeasonAndProviderPlayerId(seasonId: number, providerPlayerId: string): Promise<PlayerSeasonPoints | null> {
    const playerSeasonPoints = await prisma.playerSeasonPoints.findFirst({
      where: {
        seasonId,
        providerPlayerId
      }
    });

    if (!playerSeasonPoints) return null;

    return PrismaPlayerSeasonPointsMapper.toEntity(playerSeasonPoints);
  }

  async findBySeasonId(seasonId: number): Promise<PlayerSeasonPoints[]> {
    const playerSeasonPoints = await prisma.playerSeasonPoints.findMany({
      where: {
        seasonId,
      }
    });


    return playerSeasonPoints.map(PrismaPlayerSeasonPointsMapper.toEntity);
  }

  async getSeasonLeaderboards(limit: number, page: number): Promise<PaginatedSeasonLeaderboards> {
    const [seasonPointsLeaderboards, count] = await prisma.$transaction([
      prisma.playerSeasonPoints.findMany({
        where: {
          season: {
            active: true
          },
          player: {
            username: {
              not: null,
            },
            status: {
              not: "BANNED"
            }
          }
        },
        orderBy: [
          {
            points: 'desc',
          },
          {
            tier: 'asc',
          },
          {
            player: {
              PlayerTotalPoints: {
                points: 'desc',
              },
            },
          },
          {
            player: {
              createdAt: 'asc'
            }
          }
        ],
        select: {
          points: true,
          seasonId: true,
          tier: true,
          progress: true,
          player: {
            select: {
              username: true,
              avatarUrl: true,
              PlayerTotalPoints: {
                select: {
                  tier: true
                }
              }
            }
          }
        },
        take: limit,
        skip: ((page + 1) - 1) * limit
      }),
      prisma.playerSeasonPoints.count({
        where: {
          season: {
            active: true
          },
          player: {
            username: {
              not: null,
            },
            status: {
              not: "BANNED"
            }
          }
        },
        orderBy: [
          {
            points: 'desc',
          },
          {
            player: {
              PlayerTotalPoints: {
                points: 'desc',
              },
            },
          },
          {
            player: {
              createdAt: 'asc'
            }
          }
        ],
      })
    ])

    const seasonLeaderboards = seasonPointsLeaderboards.map(leaderboards => {
      return {
        points: leaderboards.points,
        seasonId: leaderboards.seasonId,
        tier: leaderboards.tier || 3,
        seasonTier: leaderboards.tier || 3,
        progress: leaderboards.progress,
        player: {
          username: leaderboards.player.username,
          avatarUrl: PlayerLeaderboardImage.getPlayerImage(leaderboards.tier, leaderboards.player.avatarUrl),
        }
      }
    });

    return {
      currentPage: page,
      limit: limit,
      items: seasonLeaderboards,
      nrOfPages: Math.ceil(count / limit),
      total: count
    };
  }

  async getSeasonPlayerPosition(seasonId: number, providerPlayerId: string): Promise<number> {
    const seasonPointsLeaderboards = await prisma.playerSeasonPoints.findMany({
      where: {
        seasonId,
        player: {
          username: {
            not: null,
          },
          status: {
            not: "BANNED"
          }
        }
      },
      orderBy: [
        {
          points: 'desc',
        },
        {
          player: {
            PlayerTotalPoints: {
              points: 'desc',
            },
          },
        },
        {
          player: {
            createdAt: 'asc'
          }
        }
      ],
      select: {
        providerPlayerId: true
      },
    });

    const playerPosition = seasonPointsLeaderboards.findIndex(points => points.providerPlayerId === providerPlayerId);

    return playerPosition + 1;
  }

  async getPlayerAllSeasonRegistries(providerPlayerId: string): Promise<PlayerSeasonPoints[]> {
    const seasonPoints = await prisma.playerSeasonPoints.findMany({
      where: {
        providerPlayerId
      }
    });

    return seasonPoints.map(PrismaPlayerSeasonPointsMapper.toEntity);
  }

  async deleteAllSeasonsPlayerRegistries(providerPlayerId: string): Promise<void> {
    await prisma.playerSeasonPoints.deleteMany({
      where: {
        providerPlayerId
      }
    });
  }
}