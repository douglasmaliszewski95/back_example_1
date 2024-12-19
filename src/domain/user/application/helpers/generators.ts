import { FindPlayerResponse } from "../repositories/players-repository.types";
import { ListPlayersRequestDTO, PlayerslistDTO } from "../use-cases/user/list-players-use-case";
import { createInviteCodeLink } from "./invite-code";
import { GetBasicPlayerInformationDTO } from "../@types/get-player-information-dto";
import { Player } from "../../enterprise/entities/player";

function generateListUsersResponse(
  repositoryPlayers: FindPlayerResponse[]
): PlayerslistDTO[] {
  const players = repositoryPlayers.map(player => {
    return {
      providerPlayerId: player.providerPlayerId,
      email: player.supabaseEmail ?? null,
      username: player?.username ?? null,
      wallet: player?.wallet ?? null,
      galxe: {
        discordId: player?.galxeDiscordId ?? null,
        twitterId: player?.galxeTwitterId ?? null,
        telegramId: player?.galxeTelegramId ?? null,
        email: player?.galxeEmail ?? null,
        id: player?.galxeId ?? null
      },
      totalPoints: {
        points: player?.totalPoints,
        tier: player.tier,
      },
      seasonPoints: {
        points: player?.seasonPoints,
        tier: player.tier,
      },
      inviteCode: createInviteCodeLink(player?.inviteCode || player.username) ?? "",
    };
  });

  return players;
}

function filterAndPaginatePlayers(players: PlayerslistDTO[], params: ListPlayersRequestDTO) {
  const { limit, page, discordId, email, twitterId, username, telegramId } = params;

  const filteredPlayers = players
    .filter(player => !email || (player.email && player.email.toLowerCase().includes(email.toLowerCase())))
    .filter(player => !username || (player.username && player.username.toLowerCase().includes(username.toLowerCase())))
    .filter(player => !discordId || player.galxe.discordId === discordId)
    .filter(player => !twitterId || player.galxe.twitterId === twitterId)
    .filter(player => !telegramId || player.galxe.telegramId === telegramId);

  const totalRecords = filteredPlayers.length;
  const playersList = filteredPlayers.slice((page - 1) * limit, page * limit);

  return {
    total: totalRecords,
    totalOfPages: Math.ceil(totalRecords / limit),
    list: playersList
  };
}

function generatePlayerInformationResponse(player: Player): GetBasicPlayerInformationDTO {
  return {
    wallet: player?.wallet ?? null,
    galxeDiscordId: player?.galxeDiscordId ?? null,
    galxeEmail: player?.galxeEmail ?? null,
    galxeTelegramId: player?.galxeTelegramId ?? null,
    galxeTwitterId: player?.galxeTwitterId ?? null,
    supabaseEmail: player?.supabaseEmail || null,
    username: player?.username || null,
    avatarUrl: player?.avatarUrl || null,
    inviteCode: createInviteCodeLink(player.inviteCode || "") ?? null,
    status: player?.status || null,
    galxeId: player?.galxeId || null,
    providerPlayerId: player.providerPlayerId ?? "",
    reason: player?.reason
  };
}

function generateFindPlayerResponse(player: FindPlayerResponse): GetBasicPlayerInformationDTO {
  const inviteCode = player.inviteCode;

  return {
    wallet: player?.wallet ?? null,
    galxeDiscordId: player?.galxeDiscordId ?? null,
    galxeEmail: player?.galxeEmail ?? null,
    galxeTelegramId: player?.galxeTelegramId ?? null,
    galxeTwitterId: player?.galxeTwitterId ?? null,
    supabaseEmail: player?.supabaseEmail || null,
    username: player?.username || null,
    avatarUrl: player?.avatarUrl || null,
    inviteCode: createInviteCodeLink(inviteCode),
    status: player?.status || null,
    galxeId: player?.galxeId || null,
    providerPlayerId: player.providerPlayerId ?? "",
    reason: player?.reason
  };
}

export { generateListUsersResponse, filterAndPaginatePlayers, generatePlayerInformationResponse, generateFindPlayerResponse };
