import { PlayerInviteCodesRepository } from "../../../domain/user/application/repositories/player-invite-codes-repository";
import { CreatePlayerInviteCodes, PlayerInviteCodes, ListPlayerInviteCodeParams, ListPlayerInviteCodesResponse } from "../../../domain/user/application/repositories/player-invite-codes-repository.types";
import { prisma } from "../prisma";

export class PrismaPlayerInviteCodesRepository implements PlayerInviteCodesRepository {

  async create(data: CreatePlayerInviteCodes): Promise<void> {
    await prisma.playerInviteCodes.create({
      data
    });
  }

  async findByInviteCode(inviteCode: string): Promise<PlayerInviteCodes | null> {
    const playerInviteCode = await prisma.playerInviteCodes.findFirst({
      where: {
        inviteCode
      }
    });

    if (!playerInviteCode) return null;
    return playerInviteCode;
  }

  async list(providerPlayerId: string, params: ListPlayerInviteCodeParams): Promise<ListPlayerInviteCodesResponse> {
    const [list, count] = await prisma.$transaction([
      prisma.playerInviteCodes.findMany({
        where: {
          providerPlayerId
        },
        orderBy: {
          acceptedQuantity: "desc"
        },
        take: params.limit,
        skip: (params.page - 1) * params.limit
      }),
      prisma.playerInviteCodes.count({
        where: {
          providerPlayerId
        }
      })
    ]);

    return {
      list: list,
      total: count,
      totalOfPages: Math.ceil(count / params.limit)
    }
  }
}