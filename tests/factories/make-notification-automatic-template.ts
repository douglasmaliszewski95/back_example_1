import { faker } from "@faker-js/faker";
import {
  NotificationAutomaticTemplate,
  NotificationAutomaticTemplateProps
} from "../../src/domain/notification/enterprise/entities/notification-automatic-template";
import { AutomaticNotificationTypeEnum } from "../../src/core/enums/notification-automatic-enum";
import { randomInt } from "crypto";

export function makeNotificationAutomaticTemplate(props: Partial<NotificationAutomaticTemplateProps> = {}) {
  return NotificationAutomaticTemplate.create({
    id: randomInt(1, 100),
    content: faker.lorem.paragraph(),
    title: faker.lorem.sentence(),
    type: faker.helpers.arrayElement([
      AutomaticNotificationTypeEnum.CAMPAIGN_DEADLINE,
      AutomaticNotificationTypeEnum.END_SEASON,
      AutomaticNotificationTypeEnum.NEW_CAMPAIGN,
      AutomaticNotificationTypeEnum.REWARD,
      AutomaticNotificationTypeEnum.START_SEASON,
      AutomaticNotificationTypeEnum.TIER
    ]),
    active: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: faker.internet.userName(),
    ...props
  });
}
