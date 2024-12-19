import { beforeEach, describe, expect, it } from "vitest";
import path from "path";
import fs from "fs";
import { makeAnnouncement } from "../../../../../../../tests/factories/make-announcement";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { FakeFileStorage } from "../../../../../../../tests/storage/fake-file-storage";
import { HttpException } from "../../../../../../core/errors/HttpException";
import { UploadPlayerAvatarUseCase } from "../upload-player-avatar-use-case";
import { makePlayer } from "../../../../../../../tests/factories/make-player";
import { randomUUID } from "node:crypto";

let playersRepository: PlayersRepositoryInMemory;
let fileStorage: FakeFileStorage;
let sut: UploadPlayerAvatarUseCase;

describe("Update player avatar", () => {
  beforeEach(() => {
    playersRepository = new PlayersRepositoryInMemory();
    fileStorage = new FakeFileStorage();
    sut = new UploadPlayerAvatarUseCase(playersRepository, fileStorage);
  });

  it("should be able to upload and attach a image (avatar) to an player", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID()
    });
    await playersRepository.create(player);
    const buffer = fs.readFileSync(path.join(__dirname, "avatar-test.png"));
    const response = await sut.execute(player.providerPlayerId ?? "", {
      buffer: buffer,
      fileName: "test.png",
      fileType: "image/png"
    });

    expect(response.player.avatarUrl).toBeDefined();
  });

  it("should not be able to upload a file with invalid file type", async () => {
    const player = makePlayer({
      providerPlayerId: randomUUID()
    });
    await playersRepository.create(player);

    await expect(
      sut.execute(player.providerPlayerId ?? "", {
        buffer: Buffer.from(""),
        fileName: "test.png",
        fileType: "audio/mpeg"
      })
    ).rejects.toBeInstanceOf(HttpException);
  });
});
