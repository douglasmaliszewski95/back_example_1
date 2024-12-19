import { randomInt } from "node:crypto";
import { PlayerInviteCodesRepository } from "../../src/domain/user/application/repositories/player-invite-codes-repository";
import { CreatePlayerInviteCodes, PlayerInviteCodes, ListPlayerInviteCodeParams, ListPlayerInviteCodesResponse } from "../../src/domain/user/application/repositories/player-invite-codes-repository.types";

export class PlayerInviteCodesRepositoryInMemory implements PlayerInviteCodesRepository {
  inviteCodes: PlayerInviteCodes[] = [];

  async create(data: CreatePlayerInviteCodes): Promise<void> {
    this.inviteCodes.push({
      id: randomInt(999),
      acceptedQuantity: 0,
      ...data
    });
  }

  async findByInviteCode(inviteCode: string): Promise<PlayerInviteCodes | null> {
    const code = this.inviteCodes.find(playerCode => playerCode.inviteCode === inviteCode);
    if (!code) return null;
    return code;
  }

  async list(providerPlayerId: string, params: ListPlayerInviteCodeParams): Promise<ListPlayerInviteCodesResponse> {
    const filteredInviteCodes = await this.inviteCodes.filter(inviteCode => inviteCode.providerPlayerId === providerPlayerId);
    const total = filteredInviteCodes.length;
    const totalOfPages = Math.ceil(total / params.limit);
    const paginatedInviteCodes = filteredInviteCodes.slice((params.page - 1) * params.limit, params.page * params.limit);
    return {
      list: paginatedInviteCodes,
      total: total,
      totalOfPages: totalOfPages
    }
  }
}