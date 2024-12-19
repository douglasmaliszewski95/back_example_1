import { Prisma, PlayerTotalPoints as PrismaPlayerTotalPoints } from "@prisma/client";
import { PlayerTotalPoints } from "../../../domain/season/enterprise/entities/player-total-points";

export class PrismaPlayerTotalPointsMapper {
  static toPrisma(data: PlayerTotalPoints): Prisma.PlayerTotalPointsUncheckedCreateInput {

    return {
      points: data.points,
      providerPlayerId: data.providerPlayerId,
      tier: data.tier,
      id: data.id,
      tierLastUpdatedTime: data.tierLastUpdatedTime,
      progress: data.progress
    }
  }

  static toEntity(data: PrismaPlayerTotalPoints): PlayerTotalPoints {

    return PlayerTotalPoints.create({
      points: data.points,
      providerPlayerId: data.providerPlayerId,
      tier: data.tier,
      tierLastUpdatedTime: data.tierLastUpdatedTime,
      id: data.id,
      progress: Number(data.progress)
    });
  }
}