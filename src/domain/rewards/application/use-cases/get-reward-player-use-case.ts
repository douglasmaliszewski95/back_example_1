import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { RewardsRepository } from "../repositories/rewards-repository";
import { AuthPlayerProvider } from "../../../user/application/auth-provider/auth-player-provider";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";

export class GetRewardPlayerUseCase {
  constructor(
    private authProvider: AuthPlayerProvider,
    private playersRepository: PlayersRepository,
    private rewardsRepository: RewardsRepository
  ) {}

  execute = async (reward: string, accessToken: string) => {
    if (!reward) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "You have to send the type of reward");

    const rewardExists = await this.rewardsRepository.findRewardByName(reward);
    if (!rewardExists) throw new HttpException(HttpStatus.UNAUTHORIZED, "Reward not found");
    const player = await this.authProvider.getPlayer(accessToken);
    if (!player) throw new HttpException(HttpStatus.UNAUTHORIZED, "Player not found");
    const isPlayer = await this.playersRepository.findPlayerByProviderId(player.providerPlayerId);
    if (!isPlayer) throw new HttpException(HttpStatus.UNAUTHORIZED, "User is not a player yet");

    return {
      id: rewardExists.id,
      name: rewardExists.name,
      description: rewardExists.description,
      type: rewardExists.type,
      active: rewardExists.active,
      points: rewardExists.points,
      createdAt: rewardExists.createdAt,
      updatedAt: rewardExists.updatedAt,
      RewardsHistory: rewardExists.RewardsHistory.filter(x => x.providerPlayerId === player.providerPlayerId).sort(
        (a: any, b: any) => a.createdAt - b.createdAt
      )
    };
  };
}
