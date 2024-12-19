import { describe, beforeEach, it, expect } from "vitest";
import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { FakePlayerReportService } from "../../../../../../../tests/services/fake-player-report-service";
import { GetPlayersReportUseCase } from "../get-players-report-use-case";
import { Player } from "../../../../enterprise/entities/player";
import { faker } from "@faker-js/faker";
import { PLAYER_STATUS } from "../../../../../../core/enums/player-status-enum";

let playersRepository: PlayersRepositoryInMemory;
let playerReportService: FakePlayerReportService;
let sut: GetPlayersReportUseCase;

describe("Get players report", () => {
  beforeEach(async () => {
    playersRepository = new PlayersRepositoryInMemory();
    playerReportService = new FakePlayerReportService(playersRepository);
    sut = new GetPlayersReportUseCase(playerReportService);

    for (let i = 0; i <= 11; i++) {
      await playersRepository.create(
        Player.create({
          email: faker.internet.email(),
          status: PLAYER_STATUS.PENDING_PASSWORD,
          tier: 1
        })
      );
    }
  });

  it("should be able to return a report file buffer based on filters applied", async () => {
    const response = await sut.execute({
      tier: [1]
    });

    expect(response.fileName).toBe("players-report");
    expect(response.fileFormat).toBe("xlsx");
    expect(response.file).toBeInstanceOf(Buffer);

    const fileContent = JSON.parse(response.file.toString("utf-8")).pop();

    for (const player of fileContent.list) {
      expect(player.tier).toBe(1);
    }
  });
});
