import { PlayerSeasonPoints, PlayerTotalPoints, Prisma, Player as PrismaUser, InvitedPlayers } from "@prisma/client";
import { Player } from "../../../domain/user/enterprise/entities/player";
import { FindPlayerResponse } from "../../../domain/user/application/repositories/players-repository.types";

interface PrismaUserQuery extends PrismaUser {
  PlayerSeasonPoints: PlayerSeasonPoints[];
  PlayerTotalPoints: PlayerTotalPoints | null;
  InvitingPlayers: InvitedPlayers[];
}
export class PrismaPlayersMapper {
  static toPrisma(player: Player): Prisma.PlayerUncheckedCreateInput {
    return {
      providerPlayerId: player.providerPlayerId || "",
      username: player.username,
      supabaseEmail: player.email || undefined,
      status: player.status,
      origin: player.origin,
      avatarUrl: player.avatarUrl || undefined,
      galxeDiscordId: player.galxeDiscordId || undefined,
      galxeEmail: player.galxeEmail || undefined,
      galxeId: player.galxeId || undefined,
      galxeTwitterId: player.galxeTwitterId || undefined,
      galxeTelegramId: player.galxeTelegramId || undefined,
      wallet: player.wallet || undefined,
      inviteCode: player.inviteCode || undefined
    };
  }

  static toEntity(prismaUser: PrismaUser): Player {
    return Player.create({
      id: prismaUser.id,
      username: prismaUser.username || undefined,
      wallet: prismaUser.wallet || undefined,
      galxeDiscordId: prismaUser.galxeDiscordId || undefined,
      galxeTwitterId: prismaUser.galxeTwitterId || undefined,
      galxeEmail: prismaUser.galxeEmail || undefined,
      galxeTelegramId: prismaUser.galxeTelegramId || undefined,
      providerPlayerId: prismaUser.providerPlayerId,
      email: prismaUser.supabaseEmail || "",
      password: "",
      status: prismaUser.status,
      galxeId: prismaUser.galxeId || undefined,
      supabaseEmail: prismaUser.supabaseEmail || undefined,
      origin: prismaUser.origin || undefined,
      reason: prismaUser.reason || undefined,
      avatarUrl: prismaUser.avatarUrl || undefined,
      inviteCode: prismaUser.inviteCode || undefined
    });
  }

  static toFindPlayerResponse(player: PrismaUserQuery): FindPlayerResponse {
    return {
      username: player.username ?? "",
      galxeDiscordId: player.galxeDiscordId ?? null,
      galxeTwitterId: player.galxeTwitterId ?? null,
      galxeEmail: player.galxeEmail ?? null,
      galxeTelegramId: player.galxeTelegramId ?? null,
      wallet: player.wallet ?? null,
      providerPlayerId: player.providerPlayerId,
      tier: player.PlayerSeasonPoints.length > 0 ? player.PlayerSeasonPoints[0]?.tier : 3,
      points: player.PlayerSeasonPoints.length > 0 ? player.PlayerSeasonPoints[0]?.points : 0,
      seasonPoints: player.PlayerSeasonPoints.length > 0 ? player.PlayerSeasonPoints[0]?.points : 0,
      totalPoints: player.PlayerTotalPoints ? player.PlayerTotalPoints.points : 0,
      supabaseEmail: player.supabaseEmail,
      status: player.status,
      origin: player.origin ?? "",
      reason: player.reason ?? "",
      galxeId: player.galxeId ?? null,
      createdAt: player.createdAt,
      avatarUrl: player.avatarUrl ?? null,
      inviteCode: player.inviteCode ?? null,
      acceptedInvites: player.InvitingPlayers.length ?? 0
    };
  }
}
