import { describe, beforeEach, it, expect } from 'vitest';
import { FakeAuthPlayerProvider } from "../../../../../../../tests/auth-provider/fake-auth-player-provider";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { DeletePlayerUseCase } from "../delete-player-use-case";
import { makePlayer } from '../../../../../../../tests/factories/make-player';
import { randomUUID } from 'node:crypto';

let authPlayerProvider: FakeAuthPlayerProvider;
let playersRepository: PlayersRepositoryInMemory;
let sut: DeletePlayerUseCase;

describe("Create user", () => {

  beforeEach(() => {
    authPlayerProvider = new FakeAuthPlayerProvider();
    playersRepository = new PlayersRepositoryInMemory();
    sut = new DeletePlayerUseCase(authPlayerProvider, playersRepository);
  });

  it("should be able to delete a player", async () => {
    const newPlayer = makePlayer({
      providerPlayerId: randomUUID()
    });
    await authPlayerProvider.signup(newPlayer);
    await playersRepository.create(newPlayer);

    expect(playersRepository.players.length).toEqual(1);
    expect(authPlayerProvider.players.length).toEqual(1);

    await sut.execute(newPlayer.providerPlayerId ?? "");

    expect(playersRepository.players.length).toEqual(0);
    expect(authPlayerProvider.players.length).toEqual(0);
  });
});