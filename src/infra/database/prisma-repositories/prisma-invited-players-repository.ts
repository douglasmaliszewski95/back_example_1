import { InvitedPlayersRepository } from "../../../domain/user/application/repositories/invited-players-repository";
import { InvitedPlayersCreateData, InvitedPlayersList } from "../../../domain/user/application/repositories/invited-players-repository.types";
import { prisma } from "../prisma";

export class PrismaInvitedPlayersRepository implements InvitedPlayersRepository {
  async create(data: InvitedPlayersCreateData): Promise<void> {
    await prisma.invitedPlayers.create({
      data: {
        invitedProviderPlayerId: data.invitedProviderPlayerId,
        invitingProviderPlayerId: data.invitingProviderPlayerId,
        inviteCode: data.inviteCode
      }
    })
  }

  async list(providerPlayerId: string, limit: number, page: number): Promise<InvitedPlayersList> {
    const [list, count] = await prisma.$transaction([
      prisma.invitedPlayers.findMany({
        where: {
          invitingProviderPlayerId: providerPlayerId
        },
        orderBy: {
          createdAt: "desc"
        },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          invitedPlayer: {
            select: {
              username: true
            }
          }
        }
      }),
      prisma.invitedPlayers.count({
        where: {
          invitingProviderPlayerId: providerPlayerId
        }
      })
    ]);

    return {
      list: list,
      total: count,
      totalOfPages: Math.ceil(count / limit)
    }
  }
}