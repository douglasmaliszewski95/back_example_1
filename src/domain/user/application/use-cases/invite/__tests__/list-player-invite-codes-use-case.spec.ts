import { beforeEach, describe, expect, it } from "vitest";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { PlayerInviteCodesRepositoryInMemory } from "../../../../../../../tests/repository/player-invite-codes-repository-in-memory";
import { randomUUID } from "node:crypto";
import { makePlayer } from "../../../../../../../tests/factories/make-player";
import { HttpException } from "../../../../../../core/errors/HttpException";
import { ListPlayerInviteCodesUseCase } from "../list-player-invite-codes-use-case";

let playersRepository: PlayersRepositoryInMemory;
let playerInviteCodesRepository: PlayerInviteCodesRepositoryInMemory;
let sut: ListPlayerInviteCodesUseCase;

describe("List Player Invite Codes", () => {
  beforeEach(() => {
    playersRepository = new PlayersRepositoryInMemory();
    playerInviteCodesRepository = new PlayerInviteCodesRepositoryInMemory();
    sut = new ListPlayerInviteCodesUseCase(playersRepository, playerInviteCodesRepository);
  });

  it("should be able to list paginated invite codes for player", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID(),
      username: "test-user-inviting",
    });
    await playersRepository.create(player);

    for (let i = 0; i < 30; i++) {
      await playerInviteCodesRepository.create({
        expiresIn: new Date(),
        inviteCode: `test-invite-${i}`,
        providerPlayerId: player.providerPlayerId ?? randomUUID()
      });
    }

    const response = await sut.execute(player.providerPlayerId ?? "", {
      limit: 10,
      page: 1,
    });

    expect(response.list).length(10);
    expect(response.total).toBe(30);
  });

  it("should not be able to list invite codes for a non existent player", async () => {
    await expect(sut.execute(randomUUID(), {
      limit: 10,
      page: 1,
    })).rejects.toBeInstanceOf(HttpException);
  });
});