import { PLAYER_STATUS } from "../../../../../core/enums/player-status-enum";
import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";
import { PlayersRepository } from "../../repositories/players-repository";

interface UpdatePlayerPasswordRequestDTO {
  newPassword: string;
  accessToken?: string;
  refreshToken: string;
}

export class UpdatePlayerPasswordUseCase {
  constructor(private authProvider: AuthPlayerProvider, private playerRepository: PlayersRepository) {}

  execute = async (data: UpdatePlayerPasswordRequestDTO) => {
    if (!data.newPassword) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "password is required");
    if (!data.accessToken) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "update password invalid");
    if (!data.refreshToken) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "update password invalid");
    const currentToken = data.accessToken.split(" ");
    const token = currentToken[1];
    const authPlayer = await this.authProvider.getPlayer(token);
    if (!authPlayer) throw new HttpException(HttpStatus.UNAUTHORIZED, "Unauthorized");
    const repositoryPlayer = await this.playerRepository.getPlayerByEmail(authPlayer.email || "");

    await this.authProvider.updatePlayerPassword(data.newPassword, token, data.refreshToken);

    if (repositoryPlayer?.status === PLAYER_STATUS.PENDING_PASSWORD) {
      await this.playerRepository.updatePlayer(repositoryPlayer.providerPlayerId, {
        status: PLAYER_STATUS.PENDING_ACCOUNT
      });
    }

    return await this.authProvider.signin({
      email: authPlayer.email as string,
      password: data.newPassword
    });
  };
}
