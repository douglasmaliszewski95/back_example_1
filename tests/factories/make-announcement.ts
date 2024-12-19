import { faker } from "@faker-js/faker";
import { Announcement, AnnouncementProps } from "../../src/domain/announcement/enterprise/entities/announcement";

export function makeAnnouncement(props: Partial<AnnouncementProps> = {}) {
  return Announcement.create({
    message: faker.lorem.text(),
    tier: faker.helpers.arrayElements([1, 2, 3]),
    title: faker.animal.cat(),
    startDate: new Date(new Date().getTime() + 60 * 1000),
    endDate: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    ...props
  });
}
