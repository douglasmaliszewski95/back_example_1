import { System, SystemProps } from "../../src/domain/system/enterprise/entities/system";
import { faker } from "@faker-js/faker";

export function makeSystem(props: Partial<SystemProps> = {}) {
  return System.create({
    createdAt: new Date(),
    updatedAt: new Date(),
    description: props.name || faker.lorem.sentence(),
    name: props.name || faker.lorem.words(),
    systemId: faker.string.uuid(),
    id: props.id || faker.number.int(),
    status: props.status || "PENDING"
  });
}
