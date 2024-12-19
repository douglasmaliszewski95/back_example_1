import { Player } from "../../enterprise/entities/player";
import {
  FindPlayerResponse,
  FindPlayerResponseDTO,
  ListAllPlayersFilters,
  SearchPlayersFilters,
  UpdatePlayerRequestDTO
} from "./players-repository.types";

export interface PlayersRepository {
  create(data: Player): Promise<Player>;
  attachAvatar(providerPlayerId: string, url: string): Promise<Player>;
  fetchAllPlayers(): Promise<FindPlayerResponse[]>;
  getPlayerByEmail(email: string): Promise<FindPlayerResponse | null>;
  listAllPlayers(filters: ListAllPlayersFilters): Promise<FindPlayerResponseDTO>;
  count(filters: ListAllPlayersFilters): Promise<number>;
  findPlayerById(id: number): Promise<FindPlayerResponse | null>;
  findPlayerByProviderId(providerPlayerId: string): Promise<FindPlayerResponse | null>;
  findPlayerByTelegramId(telegramId: string): Promise<FindPlayerResponse | null>;
  getPlayersByUserNameList(usernameList: string[]): Promise<Player[]>;
  listPlayers(ids: string[]): Promise<FindPlayerResponse[]>;
  updatePlayer(id: string, data: UpdatePlayerRequestDTO): Promise<Player>;
  delete(providerPlayerId: string): Promise<void>;
  findByUsername(username: string): Promise<Player | null>;
  findByInviteCode(inviteCode: string): Promise<Player | null>;
  findByGalxeId(id: string): Promise<Player | null>;
  searchPlayersByActiveSeason(filters: SearchPlayersFilters): Promise<FindPlayerResponse[]>;
}
