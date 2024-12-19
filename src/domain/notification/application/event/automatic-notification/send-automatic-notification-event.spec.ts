import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationsRepositoryInMemory } from "../../../../../../tests/repository/notifications-repository-in-memory";
import { NotificationsRegistryRepositoryInMemory } from "../../../../../../tests/repository/notifications-registry-repository-in-memory";
import { PlayersRepositoryInMemory } from "../../../../../../tests/repository/players-repository-in-memory";
import { FakeAutomaticNotificationTemplateBuilder } from "../../../../../../tests/services/fake-automatic-notification-template-builder";
import { SendAutomaticNotificationEvent } from "./send-automatic-notification-event";
import { ApplicationLogRepositoryInMemory } from "../../../../../../tests/repository/application-log-repository-in-memory";
import { NotificationAutomaticTemplateRepositoryInMemory } from "../../../../../../tests/repository/notification-automatic-template-repository-in-memory";
import { AutomaticNotificationTypeEnum } from "../../../../../core/enums/notification-automatic-enum";
import { ChangeType, RewardType } from "../send-automatic-notification-event.types";
import { makePlayer } from "../../../../../../tests/factories/make-player";
import { NotificationTypeEnum } from "../../../../../core/enums/notification-type-enum";

let notificationsRepository: NotificationsRepositoryInMemory;
let notificationRegistryRepository: NotificationsRegistryRepositoryInMemory;
let playersRepository: PlayersRepositoryInMemory;
let automaticNotificationTemplateBuilder: FakeAutomaticNotificationTemplateBuilder;
let sut: SendAutomaticNotificationEvent;

describe("Send Automatic Notification Event", () => {

  beforeEach(() => {
    notificationsRepository = new NotificationsRepositoryInMemory();
    notificationRegistryRepository = new NotificationsRegistryRepositoryInMemory();
    playersRepository = new PlayersRepositoryInMemory();
    automaticNotificationTemplateBuilder = new FakeAutomaticNotificationTemplateBuilder(new NotificationAutomaticTemplateRepositoryInMemory(), new ApplicationLogRepositoryInMemory());
    sut = new SendAutomaticNotificationEvent(notificationsRepository, notificationRegistryRepository, playersRepository, automaticNotificationTemplateBuilder);
  });

  it("should be able to send new campaign notification", async () => {
    await sut.send({
      type: AutomaticNotificationTypeEnum.NEW_CAMPAIGN,
      data: {
        campaignName: 'campaign test'
      }
    });

    expect(notificationsRepository.notifications.length).toEqual(1);
    expect(notificationsRepository.notifications[0].type).toEqual(NotificationTypeEnum.AUTOMATIC);
    expect(notificationsRepository.notifications[0].title).toContain(AutomaticNotificationTypeEnum.NEW_CAMPAIGN);
  });

  it("should be able to send campaign deadline notification", async () => {
    await sut.send({
      type: AutomaticNotificationTypeEnum.CAMPAIGN_DEADLINE,
      data: {
        campaignName: 'campaign test',
        endDate: new Date()
      }
    });

    expect(notificationsRepository.notifications.length).toEqual(1);
    expect(notificationsRepository.notifications[0].type).toEqual(NotificationTypeEnum.AUTOMATIC);
    expect(notificationsRepository.notifications[0].title).toContain(AutomaticNotificationTypeEnum.CAMPAIGN_DEADLINE);
  });

  it("should be able to send new season starting notification", async () => {
    await sut.send({
      type: AutomaticNotificationTypeEnum.START_SEASON,
      data: {
        seasonName: 'season test',
        startDate: new Date()
      }
    });

    expect(notificationsRepository.notifications.length).toEqual(1);
    expect(notificationsRepository.notifications[0].type).toEqual(NotificationTypeEnum.AUTOMATIC);
    expect(notificationsRepository.notifications[0].title).toContain(AutomaticNotificationTypeEnum.START_SEASON);
  });

  it("should be able to send end season notification", async () => {
    await sut.send({
      type: AutomaticNotificationTypeEnum.END_SEASON,
      data: {
        seasonName: 'campaign test',
        endDate: new Date()
      }
    });

    expect(notificationsRepository.notifications.length).toEqual(1);
    expect(notificationsRepository.notifications[0].type).toEqual(NotificationTypeEnum.AUTOMATIC);
    expect(notificationsRepository.notifications[0].title).toContain(AutomaticNotificationTypeEnum.END_SEASON);
  });

  it("should be able to send reward notification", async () => {
    const player = await playersRepository.create(makePlayer());

    await sut.send({
      type: AutomaticNotificationTypeEnum.REWARD,
      data: {
        providerPlayerId: player.providerPlayerId ?? "",
        rewardQuantity: '10',
        rewardType: RewardType.POINTS
      }
    });

    expect(notificationsRepository.notifications.length).toEqual(1);
    expect(notificationsRepository.notifications[0].type).toEqual(NotificationTypeEnum.AUTOMATIC);
    expect(notificationsRepository.notifications[0].title).toContain(AutomaticNotificationTypeEnum.REWARD);
    expect(notificationRegistryRepository.notificationRegistry.length).toEqual(1);
  });

  it("should be able to send tier notification", async () => {
    const player = await playersRepository.create(makePlayer());

    await sut.send({
      type: AutomaticNotificationTypeEnum.TIER,
      data: {
        providerPlayerId: player.providerPlayerId ?? "",
        changeType: ChangeType.ADD,
        tier: 2
      }
    });

    expect(notificationsRepository.notifications.length).toEqual(1);
    expect(notificationsRepository.notifications[0].type).toEqual(NotificationTypeEnum.AUTOMATIC);
    expect(notificationsRepository.notifications[0].title).toContain(AutomaticNotificationTypeEnum.TIER);
    expect(notificationRegistryRepository.notificationRegistry.length).toEqual(1);
  });
});