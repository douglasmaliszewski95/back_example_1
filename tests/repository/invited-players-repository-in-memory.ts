import { InvitedPlayersRepository } from "../../src/domain/user/application/repositories/invited-players-repository";
import {
  InvitedPlayersCreateData,
  InvitedPlayersList
} from "../../src/domain/user/application/repositories/invited-players-repository.types";

interface InvitedList {
  id: number;
  invitedProviderPlayerId: string;
  invitingProviderPlayerId: string;
  invitedPlayer: {
    username: string | null;
  };
  inviteCode: string;
  createdAt: Date;
}

export class InvitedPlayersRepositoryInMemory implements InvitedPlayersRepository {
  invitedPlayers: InvitedPlayersCreateData[] = [];
  invitedList: InvitedList[] = [];

  async create(data: InvitedPlayersCreateData): Promise<void> {
    this.invitedPlayers.push(data);
  }
  async list(providerPlayerId: string, limit: number, page: number): Promise<InvitedPlayersList> {
    const filteredInvited = await this.invitedList.filter(
      invite => invite.invitingProviderPlayerId === providerPlayerId
    );
    const total = filteredInvited.length;
    const totalOfPages = Math.ceil(total / limit);
    const paginatedInvited = filteredInvited.slice((page - 1) * limit, page * limit);
    return {
      list: paginatedInvited,
      total: total,
      totalOfPages: totalOfPages
    };
  }
}
