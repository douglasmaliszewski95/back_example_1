import { SystemStatus } from "../../../../../core/enums/system-status-enum";
import { HttpStatus } from "../../../../../core/errors/http-status";
import { HttpException } from "../../../../../core/errors/HttpException";
import { SystemRepository } from "../../../../system/application/repositories/system-repository";
import { createInviteCodeLink } from "../../helpers/invite-code";
import { PlayersRepository } from "../../repositories/players-repository";
import { PlayerslistDTO } from "./list-players-use-case";

export class FindPlayerByIdUseCase {
  constructor(private playersRepository: PlayersRepository, private systemsRepository: SystemRepository) { }

  execute = async (telegramId: string, system: string): Promise<PlayerslistDTO | null> => {
    const systemExists = await this.systemsRepository.findBySystemId(system);
    if (!systemExists) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid system");
    const systemActive = systemExists.status === SystemStatus.ACTIVE;
    if (!systemActive) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "invalid system");
    const player = await this.playersRepository.findPlayerByTelegramId(telegramId);
    if (!player) return null;

    return {
      providerPlayerId: player.providerPlayerId ?? "",
      email: player.supabaseEmail ?? null,
      username: player?.username ?? null,
      wallet: player?.wallet ?? null,
      galxe: {
        discordId: player?.galxeDiscordId ?? null,
        twitterId: player?.galxeTwitterId ?? null,
        telegramId: player?.galxeTelegramId ?? null,
        email: player?.galxeEmail ?? null,
        id: player?.galxeId ?? null
      },
      totalPoints: {
        points: player?.totalPoints,
        tier: player.tier,
      },
      seasonPoints: {
        points: player?.seasonPoints,
        tier: player.tier,
      },
      inviteCode: createInviteCodeLink(player?.inviteCode || player.username) ?? "",
    };
  }
}