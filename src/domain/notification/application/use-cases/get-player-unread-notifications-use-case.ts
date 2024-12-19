import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { AuthPlayerProvider } from "../../../user/application/auth-provider/auth-player-provider";
import { NotificationStatusEnum } from "../../../../core/enums/notification-status-enum";
import { NotificationsRegistryRepository } from "../repositories/notifications-registry-repository";

interface GetPlayerUnreadNotificationsResponseDTO {
  hasUnread: boolean;
  total: number;
}

export class GetPlayerUnreadNotificationsUseCase {
  constructor(
    private notificationsRegistryRepository: NotificationsRegistryRepository,
    private playersRepository: PlayersRepository,
    private authPlayerProvider: AuthPlayerProvider
  ) {}

  execute = async (accessToken: string): Promise<GetPlayerUnreadNotificationsResponseDTO> => {
    const { providerPlayerId } = await this.getUserInfo(accessToken);
    const player = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    if (!player) throw new HttpException(HttpStatus.NOT_FOUND, "Player not found");

    const total = await this.notificationsRegistryRepository.countForPlayer(player.providerPlayerId, {
      isRead: false,
      isDeleted: false,
      notificationStartDate: new Date(),
      notificationStatus: NotificationStatusEnum.ACTIVE
    });

    return {
      hasUnread: total > 0,
      total
    };
  };

  private getUserInfo = async (token: string): Promise<{ providerPlayerId: string }> => {
    const user = await this.authPlayerProvider.getPlayer(token);
    if (!user) throw new HttpException(HttpStatus.UNAUTHORIZED, "User not found");

    return {
      providerPlayerId: user.providerPlayerId
    };
  };
}
