import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";
import { PlayersRepository } from "../../repositories/players-repository";

export class DeletePlayerUseCase {
  constructor(
    private authPlayerProvider: AuthPlayerProvider,
    private playersRepository: PlayersRepository,
  ) { }

  execute = async (providerPlayerId?: string, username?: string, email?: string) => {
    if (username) await this.deleteByUsername(username);
    if (providerPlayerId) await this.deleteByProviderId(providerPlayerId);
    if (email) await this.deleteByEmail(email);
  }

  private deleteByProviderId = async (providerPlayerId: string) => {
    const player = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    if (player) {
      await this.playersRepository.delete(providerPlayerId);
      await this.deleteFromAuthProvider(player.providerPlayerId);
    }
  }

  private deleteByUsername = async (username: string) => {
    const player = await this.playersRepository.findByUsername(username);
    if (player && player.providerPlayerId) {
      await this.playersRepository.delete(player.providerPlayerId);
      await this.deleteFromAuthProvider(player.providerPlayerId);
    }
  }

  private deleteByEmail = async (email: string) => {
    const player = await this.playersRepository.getPlayerByEmail(email);
    if (player && player.providerPlayerId) {
      await this.playersRepository.delete(player.providerPlayerId);
      await this.deleteFromAuthProvider(player.providerPlayerId);
    }
  }

  private deleteFromAuthProvider = async (providerPlayerId: string) => {
    const playerExistsOnProvider = await this.authPlayerProvider.getPlayerById(providerPlayerId);
    if (playerExistsOnProvider) await this.authPlayerProvider.delete(providerPlayerId);
  }
}