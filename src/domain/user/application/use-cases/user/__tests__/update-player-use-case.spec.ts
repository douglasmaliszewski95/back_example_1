import { describe, beforeEach, it, expect } from "vitest";
import { randomUUID } from "node:crypto";
import { FakeAuthPlayerProvider } from "../../../../../../../tests/auth-provider/fake-auth-player-provider";
import { makePlayer } from "../../../../../../../tests/factories/make-player";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { HttpException } from "../../../../../../core/errors/HttpException";
import { UpdatePlayerUseCase } from "../update-player-use-case";

let playersRepository: PlayersRepositoryInMemory;
let authProvider: FakeAuthPlayerProvider;
let sut: UpdatePlayerUseCase;

describe("Update Player", () => {
  beforeEach(() => {
    playersRepository = new PlayersRepositoryInMemory();
    authProvider = new FakeAuthPlayerProvider();
    sut = new UpdatePlayerUseCase(playersRepository, authProvider);
  });

  it("should be able to update player information", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID()
    });
    await authProvider.signup(player);
    await playersRepository.create(player);
    const { token } = await authProvider.signin({
      email: player.email,
      password: player.password || ""
    });

    const bearerToken = `Bearer ${token}`;
    const response = await sut.execute(bearerToken, {
      username: "test-username"
    });

    expect(response.player.username).toEqual(expect.any(String));
  });

  it("should not be able to update a player that not exists", async () => {
    await expect(
      sut.execute("test-token", {
        username: "test-username"
      })
    ).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to update player without accessToken", async () => {
    await expect(
      sut.execute("", {
        username: "test-username"
      })
    ).rejects.toBeInstanceOf(HttpException);
  });
});
