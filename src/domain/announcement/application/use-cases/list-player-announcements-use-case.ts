import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { AuthPlayerProvider } from "../../../user/application/auth-provider/auth-player-provider";
import { AnnouncementsRepository } from "../repositories/announcements-repository";
import { ListAnnouncementsForPlayerResponseDTO } from "../repositories/announcements-repository.types";

export class ListPlayerAnnouncementsUseCase {
  constructor(
    private announcementsRepository: AnnouncementsRepository,
    private playersRepository: PlayersRepository,
    private authPlayerProvider: AuthPlayerProvider
  ) { }

  execute = async (token: string): Promise<ListAnnouncementsForPlayerResponseDTO> => {
    const { providerPlayerId } = await this.getUserInfo(token);
    const player = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    // if (!player) throw new HttpException(HttpStatus.NOT_FOUND, "Player not found");
    if (!player) return { list: [], total: 0 };
    const announcementsList = await this.announcementsRepository.listForPlayer(providerPlayerId, {
      tier: player.tier.toString(),
      effectiveDate: new Date(),
    });
    return announcementsList;
  };

  private getUserInfo = async (token: string): Promise<{ providerPlayerId: string }> => {
    const user = await this.authPlayerProvider.getPlayer(token);
    if (!user) throw new HttpException(HttpStatus.UNAUTHORIZED, "User not found");

    return {
      providerPlayerId: user.providerPlayerId
    };
  };
}
