import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";
import { PlayersRepository } from "../../repositories/players-repository";

export class UserHasWalletUseCase {
  constructor(private authProvider: AuthPlayerProvider, private playersRepository: PlayersRepository) {}

  execute = async (accessToken: string) => {
    const player = await this.authProvider.getPlayer(accessToken);
    if (!player) throw new HttpException(HttpStatus.UNAUTHORIZED, "Player not found");
    const playersRepository = await this.playersRepository.findPlayerByProviderId(player.providerPlayerId);
    if (!playersRepository) throw new HttpException(HttpStatus.UNAUTHORIZED, "Player not found by providerPlayerId");
    return {
      hasWallet: playersRepository?.wallet ? true : false
    };
  };
}
