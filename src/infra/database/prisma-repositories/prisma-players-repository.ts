import { Prisma } from "@prisma/client";
import { PlayersRepository } from "../../../domain/user/application/repositories/players-repository";
import {
  FindPlayerResponse,
  FindPlayerResponseDTO,
  ListAllPlayersFilters,
  SearchPlayersFilters,
  UpdatePlayerRequestDTO
} from "../../../domain/user/application/repositories/players-repository.types";
import { Player } from "../../../domain/user/enterprise/entities/player";
import { PrismaPlayersMapper } from "../mappers/prisma-players-mapper";
import { prisma } from "../prisma";

export class PrismaPlayersRepository implements PlayersRepository {
  private readonly includePlayerFields: Prisma.PlayerInclude = {
    InvitingPlayers: {
      select: {
        id: true
      }
    },
    PlayerSeasonPoints: {
      where: {
        season: {
          active: true
        }
      },
      select: {
        points: true,
        tier: true
      }
    },
    PlayerTotalPoints: {
      select: {
        points: true
      }
    }
  };

  async getPlayerByEmail(email: string): Promise<FindPlayerResponse | null> {
    const player = await prisma.player.findFirst({
      where: {
        supabaseEmail: email
      },
      include: this.includePlayerFields
    });

    if (!player) return null;

    return PrismaPlayersMapper.toFindPlayerResponse(player);
  }

  async count(filters: ListAllPlayersFilters): Promise<number> {
    const count = await prisma.player.count({
      where: this.buildListAllPlayersFilters(filters)
    });

    return count;
  }

  async listAllPlayers(filters: ListAllPlayersFilters): Promise<FindPlayerResponseDTO> {
    const needPagination = filters.page && filters.limit;
    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where: this.buildListAllPlayersFilters(filters),
        orderBy: [
          {
            InvitingPlayers: {
              _count: "desc"
            }
          },
          {
            createdAt: "desc"
          }
        ],
        take: filters.limit,
        skip: needPagination && (filters.page! - 1) * filters.limit!,
        include: this.includePlayerFields
      }),
      this.count(filters)
    ]);

    return {
      total,
      totalOfPages: needPagination ? Math.ceil(total / filters.limit!) : 1,
      list: players.map(PrismaPlayersMapper.toFindPlayerResponse)
    };
  }

  async fetchAllPlayers(): Promise<FindPlayerResponse[]> {
    const players = await prisma.player.findMany({
      include: this.includePlayerFields
    });

    if (players.length === 0) return [];
    const transformedPlayers = players.map(PrismaPlayersMapper.toFindPlayerResponse);

    return transformedPlayers;
  }

  async create(data: Player): Promise<Player> {
    const user = await prisma.player.create({
      data: PrismaPlayersMapper.toPrisma(data),
      include: this.includePlayerFields
    });

    return PrismaPlayersMapper.toEntity(user);
  }

  async findPlayerById(id: number): Promise<FindPlayerResponse | null> {
    const player = await prisma.player.findFirst({
      where: {
        id: id
      },
      include: this.includePlayerFields
    });

    if (!player) return null;

    return PrismaPlayersMapper.toFindPlayerResponse(player);
  }

  async findPlayerByProviderId(providerPlayerId: string): Promise<FindPlayerResponse | null> {
    const player = await prisma.player.findFirst({
      where: {
        providerPlayerId
      },
      include: this.includePlayerFields
    });

    if (!player) return null;

    return PrismaPlayersMapper.toFindPlayerResponse(player);
  }

  async listPlayers(ids: string[]): Promise<FindPlayerResponse[]> {
    const players = await prisma.player.findMany({
      where: {
        providerPlayerId: {
          in: ids
        }
      },
      include: this.includePlayerFields
    });

    if (players.length === 0) return [];
    const transformedPlayers = players.map(player => {
      return PrismaPlayersMapper.toFindPlayerResponse(player);
    });

    return transformedPlayers;
  }

  async updatePlayer(id: string, data: UpdatePlayerRequestDTO): Promise<Player> {
    const updatedPlayer = await prisma.player.update({
      where: {
        providerPlayerId: id
      },
      data
    });

    return PrismaPlayersMapper.toEntity(updatedPlayer);
  }

  async getPlayersByUserNameList(usernameList: string[]): Promise<Player[]> {
    const players = await prisma.player.findMany({
      where: {
        username: {
          in: usernameList
        }
      }
    });

    return players.map(player => PrismaPlayersMapper.toEntity(player));
  }

  async delete(providerPlayerId: string): Promise<void> {
    await prisma.player.delete({
      where: {
        providerPlayerId
      }
    });
  }

  async attachAvatar(providerPlayerId: string, url: string): Promise<Player> {
    const player = await prisma.player.update({
      where: {
        providerPlayerId
      },
      data: {
        avatarUrl: url
      }
    });

    return PrismaPlayersMapper.toEntity(player);
  }

  async findByUsername(username: string): Promise<Player | null> {
    const player = await prisma.player.findFirst({
      where: {
        username
      }
    });
    if (!player) return null;
    return PrismaPlayersMapper.toEntity(player);
  }

  async findByInviteCode(inviteCode: string): Promise<Player | null> {
    const player = await prisma.player.findFirst({
      where: {
        inviteCode
      }
    });
    if (!player) return null;
    return PrismaPlayersMapper.toEntity(player);
  }

  private buildListAllPlayersFilters(filters: ListAllPlayersFilters): Prisma.PlayerWhereInput {
    const filtersInput: Prisma.PlayerWhereInput[] = [];

    if (filters.email) {
      filtersInput.push({
        supabaseEmail: {
          contains: filters.email,
          mode: "insensitive"
        }
      });
    }

    if (filters.endCreatedAt || filters.startCreatedAt) {
      filtersInput.push({
        createdAt: {
          gte: filters.startCreatedAt,
          lte: filters.endCreatedAt
        }
      });
    }

    if (filters.id) {
      filtersInput.push({
        id: filters.id
      });
    }

    if (filters.username) {
      filtersInput.push({
        username: {
          contains: filters.username,
          mode: "insensitive"
        }
      });
    }

    if (filters.tier) {
      filtersInput.push({
        PlayerSeasonPoints: {
          some: {
            season: {
              active: true
            },
            tier: {
              in: filters.tier
            }
          }
        }
      });
    }

    if (filters.status) {
      filtersInput.push({
        status: {
          in: filters.status
        }
      });
    }

    if (filters.wallet) {
      filtersInput.push({
        wallet: {
          contains: filters.wallet,
          mode: "insensitive"
        }
      });
    }

    if (filters.seasonPoints) {
      filtersInput.push({
        PlayerSeasonPoints: {
          some: {
            season: {
              active: true
            },
            points: {
              gte: filters.seasonPoints.start,
              lte: filters.seasonPoints.end
            }
          }
        }
      });
    }

    if (filters.totalPoints) {
      filtersInput.push({
        PlayerTotalPoints: {
          points: {
            gte: filters.totalPoints.start,
            lte: filters.totalPoints.end
          }
        }
      });
    }

    return {
      AND: filtersInput
    };
  }

  private buildFilteredPlayers(filters: SearchPlayersFilters): Prisma.PlayerWhereInput {
    const filtersInput: Prisma.PlayerWhereInput[] = [];

    if (filters.includeProviderPlayerIds && filters.includeProviderPlayerIds.length > 0) {
      filtersInput.push({
        providerPlayerId: {
          in: filters.includeProviderPlayerIds
        }
      });
    }

    if (filters.tier && filters.tier.length > 0) {
      filtersInput.push({
        PlayerSeasonPoints: {
          some: {
            season: {
              active: true
            },
            tier: {
              in: filters.tier
            }
          }
        }
      });
    }

    if (filters.seasonPoints && filters.seasonPoints.length > 0) {
      const seasonPointsFilters = filters.seasonPoints.map(points => ({
        PlayerSeasonPoints: {
          some: {
            season: {
              active: true
            },
            points: {
              gte: points.start,
              lte: points.end
            }
          }
        }
      }));
      filtersInput.push({
        OR: seasonPointsFilters
      });
    }

    if (filters.totalPoints && filters.totalPoints.length > 0) {
      const totalPointsFilters = filters.totalPoints.map(points => ({
        PlayerTotalPoints: {
          points: {
            gte: points.start,
            lte: points.end
          }
        }
      }));
      filtersInput.push({
        OR: totalPointsFilters
      });
    }

    return {
      OR: filtersInput
    };
  }

  async findByGalxeId(id: string): Promise<Player | null> {
    const player = await prisma.player.findFirst({
      where: {
        galxeId: id
      }
    });
    if (!player) return null;
    return PrismaPlayersMapper.toEntity(player);
  }

  async searchPlayersByActiveSeason(filters: SearchPlayersFilters): Promise<FindPlayerResponse[]> {
    const players = await prisma.player.findMany({
      where: this.buildFilteredPlayers(filters),
      include: this.includePlayerFields
    });

    return players.map(PrismaPlayersMapper.toFindPlayerResponse);
  }

  async findPlayerByTelegramId(telegramId: string): Promise<FindPlayerResponse | null> {
    const player = await prisma.player.findFirst({
      where: {
        galxeTelegramId: telegramId
      },
      include: this.includePlayerFields
    });
    if (!player) return null;
    return PrismaPlayersMapper.toFindPlayerResponse(player);
  }
}
