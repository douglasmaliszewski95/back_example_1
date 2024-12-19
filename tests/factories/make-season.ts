import { Season, SeasonProps } from "../../src/domain/season/enterprise/entities/season";
import { faker } from "@faker-js/faker";

export function makeSeason(props: Partial<SeasonProps> = {}) {

  return Season.create({
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    endAt: new Date(new Date().getTime() + (60 * 1000)),
    startAt: new Date(new Date().getTime() + (1 * 60 * 60 * 1000)),
    active: false,
    ...props
  })
}