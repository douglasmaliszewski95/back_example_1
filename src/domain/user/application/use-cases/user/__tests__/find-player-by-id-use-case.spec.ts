import { describe, beforeEach, it, expect } from "vitest";
import { makePlayer } from "../../../../../../../tests/factories/make-player";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { HttpException } from "../../../../../../core/errors/HttpException";
import { FindPlayerByIdUseCase } from "../find-player-by-id-use-case";
import { SystemRepositoryInMemory } from "../../../../../../../tests/repository/system-repository-in-memory";
import { randomUUID } from "node:crypto";
import { makeSystem } from "../../../../../../../tests/factories/make-system";
import { SystemStatus } from "../../../../../../core/enums/system-status-enum";

let playersRepository: PlayersRepositoryInMemory;
let systemsRepository: SystemRepositoryInMemory;
let sut: FindPlayerByIdUseCase;

describe("Find Player by Id", () => {
  beforeEach(() => {
    playersRepository = new PlayersRepositoryInMemory();
    systemsRepository = new SystemRepositoryInMemory();
    sut = new FindPlayerByIdUseCase(playersRepository, systemsRepository);
  });

  it("should be able to find a existing player by telegram id", async () => {
    const system = makeSystem({
      status: SystemStatus.ACTIVE
    });
    systemsRepository.create(system);
    const player = makePlayer({
      providerPlayerId: randomUUID(),
      galxeTelegramId: "telegram-id"
    });
    await playersRepository.create(player);

    const response = await sut.execute("telegram-id", system.systemId);

    expect(response?.galxe.telegramId).toEqual("telegram-id");
  });

  it("should not be able to find a player without a id", async () => {
    await expect(sut.execute("", "")).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to find a non-existing player by id", async () => {
    await expect(sut.execute("test-id", "")).rejects.toBeInstanceOf(HttpException);
  });
});
