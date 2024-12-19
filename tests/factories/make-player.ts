import { PLAYER_STATUS } from "../../src/core/enums/player-status-enum";
import { PlayerProps, Player } from "../../src/domain/user/enterprise/entities/player";
import { faker } from "@faker-js/faker";

export function makePlayer(props: Partial<PlayerProps> = {}) {
  return Player.create({
    email: faker.internet.email(),
    password: faker.internet.password(),
    status: PLAYER_STATUS.PENDING_PASSWORD,
    ...props
  });
}
