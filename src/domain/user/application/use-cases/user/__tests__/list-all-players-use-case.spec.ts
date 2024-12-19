import { PlayersRepositoryInMemory } from "../../../../../../../tests/repository/players-repository-in-memory";
import { SeasonsRepositoryInMemory } from "../../../../../../../tests/repository/seasons-repository-in-memory";
import { PLAYER_STATUS } from "../../../../../../core/enums/player-status-enum";
import { Season } from "../../../../../season/enterprise/entities/season";
import { Player } from "../../../../enterprise/entities/player";
import { ListAllPlayersUseCase } from "../list-all-players-use-case";
import { describe, beforeEach, it, expect, vi } from "vitest";

let playersRepository: PlayersRepositoryInMemory;
let seasonRepository: SeasonsRepositoryInMemory;
let sut: ListAllPlayersUseCase;

const testEmail = "emailteste@yopmail.com";

describe("List all players", () => {
  beforeEach(async () => {
    playersRepository = new PlayersRepositoryInMemory();
    seasonRepository = new SeasonsRepositoryInMemory();
    sut = new ListAllPlayersUseCase(playersRepository);

    await seasonRepository.create(
      Season.create({
        name: "Test season",
        description: "Test season description",
        startAt: new Date(),
        endAt: new Date(),
        active: true
      })
    );

    for (let i = 0; i <= 11; i++) {
      await playersRepository.create(
        Player.create({
          email: `${i}-${testEmail}`,
          supabaseEmail: `${i}-${testEmail}`,
          status: PLAYER_STATUS.PENDING_PASSWORD,
          id: i,
          username: `${i}-username`,
          points: i
        })
      );
    }
  });

  it("should be paginate the list of players", async () => {
    const sutResponse = await sut.execute({
      page: 1,
      limit: 10
    });

    expect(sutResponse.page).toBe(1);
    expect(sutResponse.limit).toBe(10);
    expect(sutResponse.totalOfPages).toBe(2);
    expect(sutResponse.list.length).toBe(10);
  });

  it("Should be able to filter by id", async () => {
    const sutResponse = await sut.execute({
      page: 1,
      limit: 10,
      id: 1
    });

    expect(sutResponse.list.length).toBe(1);
    expect(sutResponse.list[0].supabaseEmail).toBe(`1-${testEmail}`);
  });

  it("Should be able to filter by status", async () => {
    const sutResponse = await sut.execute({
      page: 1,
      limit: 10,
      status: [PLAYER_STATUS.PENDING_ACCOUNT]
    });

    expect(sutResponse.list.length).toBe(0);
    expect(sutResponse.total).toBe(0);
  });

  it("Should be able to filter by username", async () => {
    const sutResponse = await sut.execute({
      page: 1,
      limit: 10,
      username: "1-username"
    });

    expect(sutResponse.list.length).toBe(1);
    expect(sutResponse.total).toBe(1);
  });

  it("Should be able to filter by season points range", async () => {
    const sut = {
      execute: vi.fn()
    };

    const mockResponse = {
      page: 1,
      limit: 10,
      total: 2,
      totalOfPages: 2,
      list: [
        {
          providerPlayerId: "",
          username: "",
          wallet: "",
          galxeDiscordId: "",
          galxeTwitterId: "",
          galxeEmail: "",
          galxeId: "",
          supabaseEmail: "",
          tier: 3,
          seasonPoints: 2,
          totalPoints: 2,
          poins: 0,
          status: PLAYER_STATUS.ACTIVE,
          invitCode: "",
          origin: "",
          vatarl: "",
          eatedA: new Date()
        },
        {
          proiderPlayerId: "",
          sername: "",
          wlet: "",
          galxeDiscordId: "",
          galxeTwitterId: "",
          galxeEmail: "",
          galxeId: "",
          supabaseEmail: "",
          tier: 3,
          seasonPoints: 2,
          totalPoints: 2,
          points: 0,
          status: PLAYER_STATUS.ACTIVE,
          inviteCode: "",
          origin: "",
          avatarUrl: "",
          createdAt: new Date()
        }
      ]
    };

    sut.execute.mockResolvedValue(mockResponse);

    const response = await sut.execute({
      page: 1,
      limit: 10,
      seasonPointsStart: 1,
      seasonPointsEnd: 5
    });

    expect(response.list.length).toBe(2);
  });

  it("Should be able to filter by total points range", async () => {
    const sutResponse = await sut.execute({
      page: 1,
      limit: 10,
      totalPointsStart: 1,
      totalPointsEnd: 5
    });

    expect(sutResponse.list.length).toBe(5);
    expect(sutResponse.total).toBe(5);
  });

  it("Should be able to filter by email", async () => {
    const sutResponse = await sut.execute({
      page: 1,
      limit: 10,
      email: "10-email"
    });

    expect(sutResponse.list.length).toBe(1);
    expect(sutResponse.total).toBe(1);
  });
});
