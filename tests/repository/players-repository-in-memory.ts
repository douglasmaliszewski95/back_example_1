import { randomUUID } from "node:crypto";
import { PlayersRepository } from "../../src/domain/user/application/repositories/players-repository";
import {
  FindPlayerResponse,
  FindPlayerResponseDTO,
  ListAllPlayersFilters,
  SearchPlayersFilters,
  UpdatePlayerRequestDTO
} from "../../src/domain/user/application/repositories/players-repository.types";
import { Player } from "../../src/domain/user/enterprise/entities/player";
import { PlayerSeasonPoints } from "../../src/domain/season/enterprise/entities/player-season-points";

type PlayerWithPoints = Player & {
  playerSeasonPoints?: PlayerSeasonPoints;
};

export class PlayersRepositoryInMemory implements PlayersRepository {
  players: PlayerWithPoints[] = [];

  private buildFindPlayerResponse(player: Player) {
    return {
      username: player.username ?? "",
      galxeDiscordId: player.galxeDiscordId ?? null,
      galxeEmail: player.galxeEmail ?? null,
      galxeTwitterId: player.galxeTwitterId ?? null,
      galxeTelegramId: player.galxeTelegramId ?? null,
      providerPlayerId: player.providerPlayerId ?? randomUUID(),
      wallet: player.wallet ?? null,
      supabaseEmail: player.supabaseEmail ?? "",
      tier: player.tier ?? 3,
      points: player.points ?? 0,
      galxeId: player.galxeId ?? "",
      createdAt: new Date(),
      inviteCode: player.inviteCode || null,
      acceptedInvites: 0,
      avatarUrl: player.avatarUrl ?? "",
      origin: player.origin || "",
      reason: player.reason || "",
      seasonPoints: 0,
      totalPoints: 0,
      status: player.status
    };
  }

  async create(data: PlayerWithPoints): Promise<Player> {
    await this.players.push(data);
    return data;
  }

  async getPlayerByEmail(email: string): Promise<FindPlayerResponse | null> {
    const player = await this.players.find(player => player.supabaseEmail === email);

    if (!player) return null;

    return this.buildFindPlayerResponse(player);
  }

  async findPlayerById(id: number): Promise<FindPlayerResponse | null> {
    const player = await this.players.find(player => player.id === id);

    if (!player) return null;

    return this.buildFindPlayerResponse(player);
  }

  async findPlayerByProviderId(providerPlayerId: string): Promise<FindPlayerResponse | null> {
    const player = await this.players.find(player => player.providerPlayerId === providerPlayerId);

    if (!player) return null;

    return this.buildFindPlayerResponse(player);
  }

  async fetchAllPlayers(): Promise<FindPlayerResponse[]> {
    return this.players.map(this.buildFindPlayerResponse);
  }
  async count(filters: ListAllPlayersFilters): Promise<number> {
    let filteredPlayers = this.players;

    if (filters.email) {
      filteredPlayers = filteredPlayers.filter(player =>
        player.supabaseEmail?.toLowerCase().includes(filters.email?.toLowerCase() ?? "")
      );
    }

    if (filters?.tier) {
      const filteredByTier = filteredPlayers.filter(player => filters.tier?.includes(player.tier ?? 909090));
      filteredPlayers.push(...filteredByTier);
    }

    if (filters.id) {
      filteredPlayers = filteredPlayers.filter(player => player.id === filters.id);
    }

    if (filters.seasonPoints) {
      if (filters.seasonPoints?.end) {
        filteredPlayers = filteredPlayers.filter(
          player => player.playerSeasonPoints?.points! <= filters.seasonPoints!.end!
        );
      }
      if (filters.seasonPoints?.start) {
        filteredPlayers = filteredPlayers.filter(
          player => player.playerSeasonPoints?.points! >= filters.seasonPoints!.start!
        );
      }
    }

    if (filters.totalPoints) {
      if (filters.totalPoints?.end) {
        filteredPlayers = filteredPlayers.filter(player => player.points! <= filters.totalPoints!.end!);
      }
      if (filters.totalPoints?.start) {
        filteredPlayers = filteredPlayers.filter(player => player.points! >= filters.totalPoints!.start!);
      }
    }

    if (filters.status) {
      filteredPlayers = filteredPlayers.filter(player => filters.status?.includes(player.status));
    }

    if (filters.username) {
      filteredPlayers = filteredPlayers.filter(player => filters.username === player.username);
    }

    return filteredPlayers.length;
  }

  async listAllPlayers(filters: ListAllPlayersFilters): Promise<FindPlayerResponseDTO> {
    let filteredPlayers = this.players;

    if (filters.email) {
      filteredPlayers = filteredPlayers.filter(player =>
        player.supabaseEmail?.toLowerCase().includes(filters.email?.toLowerCase() ?? "")
      );
    }

    if (filters?.tier) {
      const filteredByTier = filteredPlayers.filter(player => filters.tier?.includes(player.tier ?? 909090));
      filteredPlayers.push(...filteredByTier);
    }

    if (filters.id) {
      filteredPlayers = filteredPlayers.filter(player => player.id === filters.id);
    }

    if (filters.seasonPoints) {
      if (filters.seasonPoints?.end) {
        filteredPlayers = filteredPlayers.filter(
          player => player.playerSeasonPoints?.points! <= filters.seasonPoints!.end!
        );
      }
      if (filters.seasonPoints?.start) {
        filteredPlayers = filteredPlayers.filter(
          player => player.playerSeasonPoints?.points! >= filters.seasonPoints!.start!
        );
      }
    }

    if (filters.totalPoints) {
      if (filters.totalPoints?.end) {
        filteredPlayers = filteredPlayers.filter(player => player.points! <= filters.totalPoints!.end!);
      }
      if (filters.totalPoints?.start) {
        filteredPlayers = filteredPlayers.filter(player => player.points! >= filters.totalPoints!.start!);
      }
    }

    if (filters.status) {
      filteredPlayers = filteredPlayers.filter(player => filters.status?.includes(player.status));
    }

    if (filters.username) {
      filteredPlayers = filteredPlayers.filter(player => filters.username === player.username);
    }


    const paginated = filteredPlayers.slice(
      ((filters.page || 1) - 1) * (filters.limit || 10),
      (filters.page || 1) * (filters.limit || 10)
    );

    return {
      list: paginated.map(this.buildFindPlayerResponse),
      total: filteredPlayers.length,
      totalOfPages: filters.limit ? Math.ceil(filteredPlayers.length / filters.limit) : 1
    };
  }

  async listPlayers(ids: string[]): Promise<FindPlayerResponse[]> {
    let playersFromRepo = [];
    for (const id of ids) {
      const player = this.players.find(player => player.providerPlayerId === id);
      if (!player) break;
      playersFromRepo.push(this.buildFindPlayerResponse(player));
    }

    return playersFromRepo;
  }

  async updatePlayer(id: string, data: UpdatePlayerRequestDTO): Promise<Player> {
    const index = this.players.findIndex(item => item.providerPlayerId === id);
    if (data.galxeDiscordId) this.players[index].galxeDiscordId = data.galxeDiscordId;
    if (data.galxeTwitterId) this.players[index].galxeTwitterId = data.galxeTwitterId;
    if (data.galxeTelegramId) this.players[index].galxeTelegramId = data.galxeTelegramId;
    if (data.galxeEmail) this.players[index].galxeEmail = data.galxeEmail;
    if (data.galxeId) this.players[index].galxeId = data.galxeId;
    if (data.wallet) this.players[index].wallet = data.wallet;
    if (data.username) this.players[index].username = data.username;

    return this.players[index];
  }

  async getPlayersByUserNameList(usernameList: string[]): Promise<Player[]> {
    const players = this.players.filter(player => usernameList.includes(player.username ?? ""));

    const playersByUsernameList = players.map(player => {
      return Player.create({
        username: player.username ?? "",
        galxeDiscordId: player.galxeDiscordId ?? "",
        galxeEmail: player.galxeEmail ?? "",
        galxeTwitterId: player.galxeTwitterId ?? "",
        wallet: player.wallet ?? "",
        providerPlayerId: player.providerPlayerId ?? "",
        tier: player.tier ?? 3,
        points: player.points ?? 0,
        supabaseEmail: player.supabaseEmail ?? "",
        galxeId: player.galxeId ?? "",
        inviteCode: player.inviteCode || "",
        id: player.id,
        email: player.email,
        avatarUrl: player.avatarUrl ?? "",
        origin: player.origin || "",
        status: player.status,
        password: player.password
      });
    });

    return playersByUsernameList;
  }

  async delete(providerPlayerId: string): Promise<void> {
    const playerIndex = await this.players.findIndex(item => item.providerPlayerId === providerPlayerId);
    await this.players.splice(playerIndex, 1);
  }

  async attachAvatar(providerPlayerId: string, url: string): Promise<Player> {
    const playerIndex = this.players.findIndex(item => item.providerPlayerId === providerPlayerId);
    const player = this.players[playerIndex];
    if (url) player.avatarUrl = url;

    return player;
  }

  async findByUsername(username: string): Promise<Player | null> {
    const player = await this.players.find(player => player.username === username);
    if (!player) return null;
    return player;
  }

  async findByInviteCode(inviteCode: string): Promise<Player | null> {
    const player = await this.players.find(player => player.inviteCode === inviteCode);
    if (!player) return null;
    return player;
  }

  async findByGalxeId(id: string): Promise<Player | null> {
    const player = await this.players.find(player => player.galxeId === id);
    if (!player) return null;
    return player;
  }

  async searchPlayersByActiveSeason(filters: SearchPlayersFilters): Promise<FindPlayerResponse[]> {
    let filteredPlayers = this.players;

    if (filters.includeProviderPlayerIds) {
      filteredPlayers = filteredPlayers.filter(player =>
        filters.includeProviderPlayerIds?.includes(player.providerPlayerId ?? "")
      );
    }

    if (filters.seasonPoints) {
      for (const seasonPoints of filters.seasonPoints) {
        if (seasonPoints?.end) {
          filteredPlayers = filteredPlayers.filter(player => player.playerSeasonPoints?.points! <= seasonPoints!.end!);
        }
        if (seasonPoints?.start) {
          filteredPlayers = filteredPlayers.filter(
            player => player.playerSeasonPoints?.points! >= seasonPoints!.start!
          );
        }
      }
    }

    if (filters.totalPoints) {
      for (const totalPoints of filters.totalPoints) {
        if (totalPoints?.end) {
          filteredPlayers = filteredPlayers.filter(player => player.points! <= totalPoints!.end!);
        }
        if (totalPoints?.start) {
          filteredPlayers = filteredPlayers.filter(player => player.points! >= totalPoints!.start!);
        }
      }
    }

    if (filters.tier) {
      filteredPlayers = filteredPlayers.filter(player => filters.tier?.includes(player.tier ?? 3));
    }

    return filteredPlayers.map(this.buildFindPlayerResponse);
  }

  async findPlayerByTelegramId(telegramId: string): Promise<FindPlayerResponse | null> {
    const player = await this.players.find(player => player.galxeTelegramId === telegramId);
    if (!player) return null;
    return this.buildFindPlayerResponse(player);
  }
}
