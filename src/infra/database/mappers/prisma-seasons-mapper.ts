import { Prisma, Season as PrismaSeason } from "@prisma/client";
import { Season } from "../../../domain/season/enterprise/entities/season";

export class PrismaSeasonsMapper {
  static toPrisma(season: Season): Prisma.SeasonUncheckedCreateInput {

    return {
      description: season.description,
      name: season.name,
      startAt: season.startAt,
      endAt: season.endAt,
      active: season.active
    }
  }

  static toEntity(season: PrismaSeason): Season {
    return Season.create({
      active: season.active,
      description: season.description,
      endAt: season.endAt,
      name: season.name,
      startAt: season.startAt,
      id: season.id
    })
  }
}