import { PLAYER_STATUS } from "@prisma/client";
import { HttpException } from "../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { Player } from "../../../enterprise/entities/player";
import { AuthPlayerProvider } from "../../auth-provider/auth-player-provider";
import { PlayersRepository } from "../../repositories/players-repository";

export interface CreatePlayerRequestDTO {
  email: string;
  password: string;
}

export interface CreatePlayerResponseDTO {
  player: Player;
}

export class CreatePlayerUseCase {
  constructor(private authProvider: AuthPlayerProvider, private playersRepository: PlayersRepository) { }

  execute = async (data: CreatePlayerRequestDTO): Promise<CreatePlayerResponseDTO> => {
    const player = Player.create({
      ...data,
      status: PLAYER_STATUS.PENDING_ACCOUNT
    });

    const { data: providerUserData, error } = await this.authProvider.signup(player);
    if (error) throw new HttpException(error.status, error.msg);
    if (!providerUserData) throw new HttpException(HttpStatus.BAD_REQUEST, "Error while creating user");
    await this.playersRepository.create(providerUserData);

    return { player: providerUserData };
  };
}
