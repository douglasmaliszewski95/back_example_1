import { AdminStatus } from "../../src/core/enums/admin-status-enum";
import { AdminProps, Admin } from "../../src/domain/user/enterprise/entities/admin";
import { faker } from '@faker-js/faker'

export function makeAdmin(props: Partial<AdminProps> = {}) {

  return Admin.create({
    email: faker.internet.email(),
    fullname: faker.person.fullName(),
    password: faker.internet.password(),
    status: AdminStatus.INACTIVE,
    ...props
  });
}