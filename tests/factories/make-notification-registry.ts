import { faker } from "@faker-js/faker";
import { NotificationRegistry, NotificationRegistryProps } from "../../src/domain/notification/enterprise/entities/notification-registry";
import { randomInt, randomUUID } from "node:crypto";
import { NotificationRegistryOriginEnum } from "../../src/core/enums/notification-registry-origin-enum";

export function makeNotificationRegistry(props: Partial<NotificationRegistryProps> = {}) {

  return NotificationRegistry.create({
    notificationId: randomInt(100),
    origin: faker.helpers.arrayElement([NotificationRegistryOriginEnum.CSV_FILE, NotificationRegistryOriginEnum.POINTS, NotificationRegistryOriginEnum.TIER, NotificationRegistryOriginEnum.USERNAME]),
    recipientId: randomUUID(),
    id: randomInt(100),
    ...props
  });
}