import { NotificationStatusEnum } from "../../src/core/enums/notification-status-enum";
import { NotificationTypeEnum } from "../../src/core/enums/notification-type-enum";
import { Notification, NotificationProps } from "../../src/domain/notification/enterprise/entities/notification";
import { faker } from "@faker-js/faker";

export function makeNotification(props: Partial<NotificationProps> = {}) {
  return Notification.create({
    content: faker.lorem.paragraph(),
    endDate: new Date(new Date().getTime() + 60 * 1000),
    startDate: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    tier: faker.helpers.arrayElements([1, 2]),
    title: faker.lorem.sentence(),
    type: faker.helpers.arrayElement([NotificationTypeEnum.MANUAL, NotificationTypeEnum.AUTOMATIC]),
    status: faker.helpers.arrayElement([
      NotificationStatusEnum.ACTIVE,
      NotificationStatusEnum.DRAFT,
      NotificationStatusEnum.INACTIVE
    ]),
    ...props
  });
}
