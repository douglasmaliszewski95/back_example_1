import { NotificationRegistryOriginEnum } from "../../../../core/enums/notification-registry-origin-enum";
import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { SeasonsRepository } from "../../../season/application/repositories/seasons-repository";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { NotificationRegistry } from "../../enterprise/entities/notification-registry";
import { NotificationTargetPointsRepositoryRegistry } from "../repositories/notification-target-points-registry";
import { NotificationsRegistryRepository } from "../repositories/notifications-registry-repository";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface Points {
  start: number;
  end: number;
}

interface CreateNotificationRegistryRequestDTO {
  tier: number[];
  points?: Partial<Points>[];
  includePlayers?: {
    providerPlayerId: string;
    origin?: string;
  }[];
}

export class CreateNotificationRegistryUseCase {
  constructor(
    private notificationsRegistryRepository: NotificationsRegistryRepository,
    private notificationsRepository: NotificationsRepository,
    private playersRepository: PlayersRepository,
    private notificationTargetPointsRegistryRepository: NotificationTargetPointsRepositoryRegistry,
    private seasonRepository: SeasonsRepository
  ) {}

  execute = async (notificationId: number, data: CreateNotificationRegistryRequestDTO): Promise<void> => {
    const notificationExists = await this.notificationsRepository.findById(notificationId);
    if (!notificationExists) throw new HttpException(HttpStatus.NOT_FOUND, "invalid notification");
    const activeSeason = await this.seasonRepository.findActive();

    if (!activeSeason || !activeSeason.id) throw new HttpException(HttpStatus.NOT_FOUND, "active season not found");

    const [recipients] = await Promise.all([
      this.playersRepository.searchPlayersByActiveSeason({
        includeProviderPlayerIds: (data.includePlayers || []).map(player => player.providerPlayerId),
        seasonPoints: data.points,
        tier: data.tier
      }),
      this.notificationsRepository.update(notificationId, {
        tier: data.tier
      }),
      data.points
        ? this.notificationTargetPointsRegistryRepository.create({
            notificationId,
            points: data.points
          })
        : Promise.resolve()
    ]);

    const listNotificationPlayers = await this.notificationsRegistryRepository.list(notificationId, {
      limit: 999999,
      page: 1
    });
    if (listNotificationPlayers.list.length === 0) {
      await this.notificationsRegistryRepository.createMany(
        notificationId,
        recipients.map(player =>
          NotificationRegistry.create({
            notificationId: notificationId,
            origin: NotificationRegistryOriginEnum.USERNAME,
            recipientId: player.providerPlayerId
          })
        )
      );
    } else {
      const listPlayers: { providerPlayerId: string }[] = [];
      if (data.includePlayers?.length) {
        data.includePlayers.map(x => {
          const player = listNotificationPlayers.list.find(y => y.recipientId === x.providerPlayerId);
          if (!player) listPlayers.push({ providerPlayerId: x.providerPlayerId });
        });
      }
      if (data.points?.length) {
        data.points.map(x => {
          const players = recipients.filter(
            item => item.points >= (x.start ?? 0) && item.points <= (x.end ?? Infinity)
          );
          const filterPlayers = players.filter(player =>
            listNotificationPlayers.list.some(listPlayer => listPlayer.recipientId !== player.providerPlayerId)
          );
          if (filterPlayers.length) {
            listPlayers.push(
              ...filterPlayers.map(y => {
                return { providerPlayerId: y.providerPlayerId };
              })
            );
          }
        });
      }
      if (data.tier.length) {
        data.tier.map(x => {
          const players = recipients.filter(item => item.tier === x);
          const filterPlayers = players.filter(player =>
            listNotificationPlayers.list.some(listPlayer => listPlayer.recipientId !== player.providerPlayerId)
          );
          if (filterPlayers.length) {
            listPlayers.push(
              ...filterPlayers.map(y => {
                return { providerPlayerId: y.providerPlayerId };
              })
            );
          }
        });
      }

      if (listPlayers.length) {
        await this.notificationsRegistryRepository.createMany(
          notificationId,
          listPlayers.map(player =>
            NotificationRegistry.create({
              notificationId: notificationId,
              origin: NotificationRegistryOriginEnum.USERNAME,
              recipientId: player.providerPlayerId
            })
          )
        );
      }
    }
  };
}
