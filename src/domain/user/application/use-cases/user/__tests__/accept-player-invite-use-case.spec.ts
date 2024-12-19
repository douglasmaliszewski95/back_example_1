import { beforeEach, describe, expect, it } from "vitest";
import { makePlayer } from "../../../../../../../tests/factories/make-player";
import { InvitedPlayersRepositoryInMemory } from "../../../../../../../tests/repository/invited-players-repository-in-memory";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { AcceptPlayerInviteUseCase } from "../accept-player-invite-use-case";
import { randomUUID } from "node:crypto";

let playersRepository: PlayersRepositoryInMemory;
let invitedPlayersRepository: InvitedPlayersRepositoryInMemory;
let sut: AcceptPlayerInviteUseCase;

describe("Accept Player Invite", () => {
  beforeEach(() => {
    playersRepository = new PlayersRepositoryInMemory();
    invitedPlayersRepository = new InvitedPlayersRepositoryInMemory();
    sut = new AcceptPlayerInviteUseCase(playersRepository, invitedPlayersRepository);
  });

  it("should be able to accept player invite", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID(),
      username: "test-user-inviting",
      inviteCode: "test-invite-code"
    });
    await playersRepository.create(player);
    await sut.execute("test-invite-code", randomUUID());
    expect(invitedPlayersRepository.invitedPlayers).toHaveLength(1);
  });

  it("should not register a invite if the code doenst exist", async () => {
    const response = await sut.execute("test", randomUUID());
    expect(response).toBeUndefined();
  });
});