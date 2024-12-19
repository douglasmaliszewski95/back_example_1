import { PLAYER_STATUS } from "../../../../../core/enums/player-status-enum";
import { Player } from "../../../enterprise/entities/player";
import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";
import { InvitedPlayersRepository } from "../../repositories/invited-players-repository";
import { PlayersRepository } from "../../repositories/players-repository";

export class InvitePlayerUseCase {
  constructor(
    private authProvider: AuthPlayerProvider,
    private playersRepository: PlayersRepository,
    private invitedPlayersRepository: InvitedPlayersRepository
  ) { }

  async execute(email: string, inviteCode?: string) {
    const playerAlreadyExists = await this.playersRepository.getPlayerByEmail(email);
    if (playerAlreadyExists) {
      await this.authProvider.resetPasswordRequest(email);
      return;
    }
    const providerPlayerId = await this.authProvider.invitePlayer(email);

    const player = Player.create({
      email: email,
      status: PLAYER_STATUS.PENDING_PASSWORD,
      providerPlayerId: providerPlayerId,
      supabaseEmail: email
    });

    await this.playersRepository.create(player);
    if (inviteCode) await this.createInviteRegister(providerPlayerId, inviteCode);
  }

  private createInviteRegister = async (invitedProviderPlayerId: string, inviteCode: string) => {
    const invitingPlayer = await this.playersRepository.findByInviteCode(inviteCode);
    if (!invitingPlayer || !invitingPlayer.providerPlayerId) return;
    await this.invitedPlayersRepository.create({
      invitedProviderPlayerId: invitedProviderPlayerId,
      invitingProviderPlayerId: invitingPlayer.providerPlayerId,
      inviteCode
    });
  }
}
