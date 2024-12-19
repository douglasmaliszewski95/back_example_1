import { beforeEach, describe, expect, it } from "vitest";
import { AnnoucementsRepositoryInMemory } from "../../../../../../tests/repository/announcements-repository-in-memory";
import { makeAnnouncement } from "../../../../../../tests/factories/make-announcement";
import { ListPlayerAnnouncementsUseCase } from "../list-player-announcements-use-case";
import { PlayersRepositoryInMemory } from "../../../../../../tests/repository/players-repository-in-memory";
import { FakeAuthPlayerProvider } from "../../../../../../tests/auth-provider/fake-auth-player-provider";
import { makePlayer } from "../../../../../../tests/factories/make-player";

let announcementsRepository: AnnoucementsRepositoryInMemory;
let playersRepository: PlayersRepositoryInMemory;
let authPlayerProvider: FakeAuthPlayerProvider;
let sut: ListPlayerAnnouncementsUseCase;

describe("List player announcements", () => {
  beforeEach(() => {
    announcementsRepository = new AnnoucementsRepositoryInMemory();
    playersRepository = new PlayersRepositoryInMemory();
    authPlayerProvider = new FakeAuthPlayerProvider();
    sut = new ListPlayerAnnouncementsUseCase(announcementsRepository, playersRepository, authPlayerProvider);
  });

  it("should be able to list player available announcements by tier and effective date", async () => {
    const player = makePlayer({
      email: "test@test.com",
      password: "teste123",
      providerPlayerId: "123",
      tier: 1
    });

    await authPlayerProvider.signup(player);
    await playersRepository.create(player);

    const auth = await authPlayerProvider.signin({
      email: player.email,
      password: player.password as string
    });

    for (let i = 0; i < 6; i++) {
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      const oneMonthFromNow = new Date(now);
      oneMonthFromNow.setMonth(now.getMonth() + 1);
      const announcement = makeAnnouncement({
        title: `announcement-${i}`,
        tier: [(i % 3) + 1], // 1, 2 or 3
        startDate: oneMonthAgo,
        endDate: oneMonthFromNow
      });
      await announcementsRepository.create(announcement);
    }

    const response = await sut.execute(auth.token);

    expect(response.total).toEqual(2);
  });

  it("should throw an not found exception if player is not found", async () => {
    const player = makePlayer({
      email: "test@test.com",
      password: "teste123",
      providerPlayerId: "123",
      tier: 1
    });

    await authPlayerProvider.signup(player);

    const auth = await authPlayerProvider.signin({
      email: player.email,
      password: player.password as string
    });

    try {
      await sut.execute(auth.token);
    } catch (error: any) {
      expect(error?.message).toEqual("Player not found");
    }
  });

  it("should throw an unauthorized exception if token is invalid", async () => {
    try {
      await sut.execute("token");
    } catch (error: any) {
      expect(error?.message).toEqual("User not found");
    }
  });
});
