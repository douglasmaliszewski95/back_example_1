import { describe, beforeEach, it, expect } from "vitest";
import { FakeAuthPlayerProvider } from "../../../../../../../tests/auth-provider/fake-auth-player-provider";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { InvitePlayerUseCase } from "../invite-player-use-case";
import { InvitedPlayersRepositoryInMemory } from "../../../../../../../tests/repository/invited-players-repository-in-memory";

let authProvider: FakeAuthPlayerProvider;
let playersRepository: PlayersRepositoryInMemory;
let invitedPlayersRepository: InvitedPlayersRepositoryInMemory;
let sut: InvitePlayerUseCase;

const testEmail = "emailteste@yopmail.com";

describe("Create user", () => {
  beforeEach(() => {
    authProvider = new FakeAuthPlayerProvider();
    playersRepository = new PlayersRepositoryInMemory();
    invitedPlayersRepository = new InvitedPlayersRepositoryInMemory();
    sut = new InvitePlayerUseCase(authProvider, playersRepository, invitedPlayersRepository);
  });

  it("should be able to invite a new user", async () => {
    await sut.execute(testEmail);

    const createdPlayer = await playersRepository.getPlayerByEmail(testEmail);
    const authPlayer = await authProvider.getPlayerById(createdPlayer?.providerPlayerId || "");

    expect(createdPlayer).toBeDefined();
    expect(authPlayer).toBeDefined();
  });
});
