import { InvitedPlayersRepository } from "../../repositories/invited-players-repository";
import { PlayersRepository } from "../../repositories/players-repository";

export class AcceptPlayerInviteUseCase {
  constructor(private playersRepository: PlayersRepository, private invitedPlayersRepository: InvitedPlayersRepository) { }

  execute = async (inviteCode: string, invitedProviderPlayerId: string) => {
    const invitingPlayer = await this.playersRepository.findByInviteCode(inviteCode);
    if (!invitingPlayer || !invitingPlayer.providerPlayerId) return;
    await this.invitedPlayersRepository.create({
      invitedProviderPlayerId: invitedProviderPlayerId,
      invitingProviderPlayerId: invitingPlayer.providerPlayerId,
      inviteCode
    });
  }
}