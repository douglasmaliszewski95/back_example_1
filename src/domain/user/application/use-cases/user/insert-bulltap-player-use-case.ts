import { PLAYER_STATUS } from "../../../../../core/enums/player-status-enum";
import { SystemStatus } from "../../../../../core/enums/system-status-enum";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { HttpException } from "../../../../../core/errors/HttpException";
import { SystemRepository } from "../../../../system/application/repositories/system-repository";
import { Player } from "../../../enterprise/entities/player";
import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";
import { generatePlayerInformationResponse } from "../../helpers/generators";
import { PlayersRepository } from "../../repositories/players-repository";

export class InsertBulltapPlayerUseCase {
  constructor(
    private authProvider: AuthPlayerProvider,
    private playersRepository: PlayersRepository,
    private systemsRepository: SystemRepository
  ) {}

  execute = async (email: string, telegramId: string, system: string) => {
    const systemExists = await this.systemsRepository.findBySystemId(system);
    if (!systemExists) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid system");
    const systemActive = systemExists.status === SystemStatus.ACTIVE;
    if (!systemActive) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid system");
    const playerWithTelegram = await this.playersRepository.findPlayerByTelegramId(telegramId);
    if (playerWithTelegram) throw new HttpException(HttpStatus.UNAUTHORIZED, "Telegram already in use");

    const createUser = await this.authProvider.signup(
      Player.create({ email, password: "123456789", status: PLAYER_STATUS.PENDING_ACCOUNT })
    );
    if (createUser.error) throw new HttpException(createUser.error.status, createUser.error.msg);
    const player = await this.playersRepository.findPlayerByProviderId(createUser.data?.providerPlayerId as string);
    if (player) throw new HttpException(HttpStatus.UNAUTHORIZED, "Player already exists");

    const data = {
      status: PLAYER_STATUS.PENDING_ACCOUNT,
      providerPlayerId: createUser.data?.providerPlayerId,
      galxeTelegramId: telegramId
    };
    const insertedPlayer = await this.playersRepository.create(Player.create({ ...data, email }));
    return generatePlayerInformationResponse(insertedPlayer);
  };
}
