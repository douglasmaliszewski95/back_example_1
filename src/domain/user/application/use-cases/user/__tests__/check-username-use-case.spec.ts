import { beforeEach, describe, expect, it } from "vitest";
import { makePlayer } from "../../../../../../../tests/factories/make-player";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { CheckUsernameUseCase } from "../check-username-use-case";

let playersRepository: PlayersRepositoryInMemory;
let sut: CheckUsernameUseCase;

describe("check username", () => {
  beforeEach(() => {
    playersRepository = new PlayersRepositoryInMemory();;
    sut = new CheckUsernameUseCase(playersRepository);
  });

  it("should be able to check if username is valid", async () => {
    const response = await sut.execute("test-unused-username");
    expect(response.valid).toBeTruthy();
  });

  it("should be able to check if username is invalid", async () => {
    await playersRepository.create(makePlayer({
      username: "test-unused-username"
    }));

    const response = await sut.execute("test-unused-username");
    expect(response.valid).toBeFalsy();
  });
});