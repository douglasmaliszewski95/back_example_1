import { Prisma, PlayerSeasonPoints as PrismaPlayerSeasonPoints } from "@prisma/client";
import { PlayerSeasonPoints } from "../../../domain/season/enterprise/entities/player-season-points";

export class PrismaPlayerSeasonPointsMapper {
  static toPrisma(data: PlayerSeasonPoints): Prisma.PlayerSeasonPointsUncheckedCreateInput {

    return {
      points: data.points,
      providerPlayerId: data.providerPlayerId,
      seasonId: data.seasonId,
      tier: data.tier,
      lastTier: data.lastTier,
      id: data.id,
      progress: data.progress
    }
  }

  static toEntity(data: PrismaPlayerSeasonPoints): PlayerSeasonPoints {
    return PlayerSeasonPoints.create({
      points: data.points,
      providerPlayerId: data.providerPlayerId,
      seasonId: data.seasonId,
      tier: data.tier,
      lastTier: data.lastTier,
      id: data.id,
      progress: Number(data.progress)
    });
  }
}