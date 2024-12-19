import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { AuthPlayerProvider } from "../../../user/application/auth-provider/auth-player-provider";
import { NotificationStatusEnum } from "../../../../core/enums/notification-status-enum";
import { NotificationsRegistryRepository } from "../repositories/notifications-registry-repository";
import { NotificationRegistryForPlayer } from "../repositories/notifications-registry-repository.types";

interface ListPlayerNotificationsRequestDTO {
  page: number;
  limit: number;
}

interface ListPlayerNotificationsResponseDTO {
  page: number;
  total: number;
  limit: number;
  list: NotificationRegistryForPlayer[];
}

export class ListPlayerNotificationsUseCase {
  constructor(
    private notificationsRegistryRepository: NotificationsRegistryRepository,
    private playersRepository: PlayersRepository,
    private authPlayerProvider: AuthPlayerProvider
  ) {}

  execute = async (
    accessToken: string,
    params: ListPlayerNotificationsRequestDTO
  ): Promise<ListPlayerNotificationsResponseDTO> => {
    const { providerPlayerId } = await this.getUserInfo(accessToken);
    const player = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    if (!player) throw new HttpException(HttpStatus.NOT_FOUND, "Player not found");

    const notifications = await this.notificationsRegistryRepository.listForPlayer(player.providerPlayerId, {
      ...params,
      isDeleted: false,
      notificationStartDate: new Date(),
      notificationStatus: NotificationStatusEnum.ACTIVE
    });

    await this.setNotificationsAsRead(notifications.list, providerPlayerId);

    return {
      limit: params.limit,
      page: params.page,
      total: notifications.total,
      list: notifications.list
    };
  };

  private getUserInfo = async (token: string): Promise<{ providerPlayerId: string }> => {
    const user = await this.authPlayerProvider.getPlayer(token);
    if (!user) throw new HttpException(HttpStatus.UNAUTHORIZED, "User not found");

    return {
      providerPlayerId: user.providerPlayerId
    };
  };

  private setNotificationsAsRead = async (notifications: NotificationRegistryForPlayer[], providerPlayerId: string) => {
    if (notifications.length > 0) {
      const unreadNotifications = notifications.filter(notification => !notification.isRead);
      if (unreadNotifications.length > 0) {
        await this.notificationsRegistryRepository.updateManyByNotificationIdsAndPlayerProviderId(
          unreadNotifications.map(notification => notification.id!),
          providerPlayerId,
          { isRead: true, readAt: new Date() }
        );
      }
    }
  };
}
