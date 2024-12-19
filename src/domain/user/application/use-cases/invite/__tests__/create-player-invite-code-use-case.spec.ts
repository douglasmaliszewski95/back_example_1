import { beforeEach, describe, expect, it } from "vitest";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { PlayerInviteCodesRepositoryInMemory } from "../../../../../../../tests/repository/player-invite-codes-repository-in-memory";
import { CreatePlayerInviteCodeUseCase } from "../create-player-invite-code-use-case";
import { randomUUID } from "node:crypto";
import { makePlayer } from "../../../../../../../tests/factories/make-player";
import { HttpException } from "../../../../../../core/errors/HttpException";

let playersRepository: PlayersRepositoryInMemory;
let playerInviteCodesRepository: PlayerInviteCodesRepositoryInMemory;
let sut: CreatePlayerInviteCodeUseCase;

describe("Player Invite Code", () => {
  beforeEach(() => {
    playersRepository = new PlayersRepositoryInMemory();
    playerInviteCodesRepository = new PlayerInviteCodesRepositoryInMemory();
    sut = new CreatePlayerInviteCodeUseCase(playersRepository, playerInviteCodesRepository);
  });

  it("should be able to create a player invite code", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID(),
      username: "test-user-inviting",
    });
    await playersRepository.create(player);
    const response = await sut.execute({
      expiresIn: new Date(new Date().getTime() + (60 * 1000)),
      inviteCode: 'test-code',
      providerPlayerId: player.providerPlayerId ?? randomUUID()
    });

    expect(response).toBeUndefined();
  });

  it("should not be able to create a player invite code with not existing player", async () => {
    await expect(
      sut.execute({
        expiresIn: new Date(new Date().getTime() + (60 * 1000)),
        inviteCode: 'test-code',
        providerPlayerId: randomUUID()
      })
    ).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to create a player invite code if the invite code is already registered", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID(),
      username: "test-user-inviting",
    });
    await playersRepository.create(player);
    await playerInviteCodesRepository.create({
      expiresIn: new Date(),
      inviteCode: 'test-code',
      providerPlayerId: player.providerPlayerId ?? randomUUID()
    });

    await expect(
      sut.execute({
        expiresIn: new Date(new Date().getTime() + (60 * 1000)),
        inviteCode: 'test-code',
        providerPlayerId: player.providerPlayerId ?? randomUUID()
      })
    ).rejects.toBeInstanceOf(HttpException);
  });
});