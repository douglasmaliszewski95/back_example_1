import { InvitedPlayersCreateData, InvitedPlayersList } from "./invited-players-repository.types";

export interface InvitedPlayersRepository {
  create(data: InvitedPlayersCreateData): Promise<void>;
  list(providerPlayerId: string, limit: number, page: number): Promise<InvitedPlayersList>;
}
