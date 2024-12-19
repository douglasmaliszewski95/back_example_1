import { randomInt, randomUUID } from "node:crypto";
import { PlayerSeasonPoints, PlayerSeasonPointsProps } from "../../src/domain/season/enterprise/entities/player-season-points";

export function makePlayerSeasonPoints(props: Partial<PlayerSeasonPointsProps> = {}) {
  return PlayerSeasonPoints.create({
    id: randomInt(200),
    points: randomInt(1000),
    seasonId: randomInt(200),
    providerPlayerId: randomUUID(),
    tier: randomInt(3),
    lastTier: randomInt(3),
    progress: 0,
    ...props
  })
} 