import { faker } from "@faker-js/faker";
import { Task, TaskProps } from "../../src/domain/tasks/enterprise/entities/task";
import { randomInt, randomUUID } from "node:crypto";

export function makeCompletedTask(props: Partial<TaskProps> = {}) {

  return Task.create({
    completedDate: new Date(),
    description: faker.lorem.sentence(),
    name: faker.lorem.word(),
    points: randomInt(100),
    providerPlayerId: randomUUID(),
    systemId: randomUUID(),
    taskId: randomUUID(),
    seasonId: randomInt(100),
    ...props
  });
}