import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { AuthPlayerProvider } from "../../../user/application/auth-provider/auth-player-provider";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { NotificationsRegistryRepository } from "../repositories/notifications-registry-repository";

export class DeletePlayerNotificationUseCase {
  constructor(
    private notificationsRegistryRepository: NotificationsRegistryRepository,
    private playersRepository: PlayersRepository,
    private authPlayerProvider: AuthPlayerProvider
  ) {}

  execute = async (accessToken: string, notificationId: number): Promise<void> => {
    const { providerPlayerId } = await this.getUserInfo(accessToken);
    const player = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    if (!player) throw new HttpException(HttpStatus.NOT_FOUND, "Player not found");

    const notificationRegistryExists = await this.notificationsRegistryRepository.findByNotificationIdAndRecipientId(
      notificationId,
      providerPlayerId
    );
    if (!notificationRegistryExists) throw new HttpException(HttpStatus.NOT_FOUND, "Notification not found");
    await this.notificationsRegistryRepository.update(notificationRegistryExists.id!, { isDeleted: true });
  };

  private getUserInfo = async (token: string): Promise<{ providerPlayerId: string }> => {
    const user = await this.authPlayerProvider.getPlayer(token);
    if (!user) throw new HttpException(HttpStatus.UNAUTHORIZED, "User not found");

    return {
      providerPlayerId: user.providerPlayerId
    };
  };
}
