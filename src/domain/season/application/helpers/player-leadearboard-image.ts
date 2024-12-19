import { env } from "../../../../infra/env";

export class PlayerLeaderboardImage {

  public static getPlayerImage = (tier: number, avatarUrl: string | null): string => {
    if (avatarUrl) return avatarUrl;
    return this.getPlayerImageByTier(tier);
  }

  private static getPlayerImageByTier = (tier: number): string => {
    return {
      1: env.DEFAULT_TIER_1_IMAGE,
      2: env.DEFAULT_TIER_2_IMAGE,
      3: env.DEFAULT_TIER_3_IMAGE,
    }[tier] || env.DEFAULT_TIER_3_IMAGE;
  }
}