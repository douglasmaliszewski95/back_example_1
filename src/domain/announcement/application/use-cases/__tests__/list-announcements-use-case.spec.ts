import { beforeEach, describe, expect, it } from "vitest";
import { AnnoucementsRepositoryInMemory } from "../../../../../../tests/repository/announcements-repository-in-memory";
import { ListAnnouncementsUseCase } from "../list-announcements-use-case";
import { makeAnnouncement } from "../../../../../../tests/factories/make-announcement";

let announcementsRepository: AnnoucementsRepositoryInMemory;
let sut: ListAnnouncementsUseCase;

describe("List announcements", () => {
  beforeEach(() => {
    announcementsRepository = new AnnoucementsRepositoryInMemory();
    sut = new ListAnnouncementsUseCase(announcementsRepository);
  });

  it("should be able to list paginated announcements", async () => {
    for (let i = 0; i < 30; i++) {
      const announcement = makeAnnouncement({
        title: `announcement-${i}`
      });
      await announcementsRepository.create(announcement);
    }

    const response = await sut.execute({
      page: 2,
      limit: 10
    });

    expect(response.total).toEqual(30);
    expect(response.list).toEqual([
      expect.objectContaining({ title: "announcement-10" }),
      expect.objectContaining({ title: "announcement-11" }),
      expect.objectContaining({ title: "announcement-12" }),
      expect.objectContaining({ title: "announcement-13" }),
      expect.objectContaining({ title: "announcement-14" }),
      expect.objectContaining({ title: "announcement-15" }),
      expect.objectContaining({ title: "announcement-16" }),
      expect.objectContaining({ title: "announcement-17" }),
      expect.objectContaining({ title: "announcement-18" }),
      expect.objectContaining({ title: "announcement-19" })
    ]);
  });

  it("should be able to filter the list of announcements by title", async () => {
    for (let i = 0; i < 30; i++) {
      const announcement = makeAnnouncement({
        title: `announcement-${i}`
      });
      await announcementsRepository.create(announcement);
    }

    const response = await sut.execute({
      page: 1,
      limit: 10,
      title: "announcement-20"
    });

    expect(response.list).toHaveLength(1);
  });

  it("should be able to filter the list of announcements by tier", async () => {
    for (let i = 0; i < 30; i++) {
      const announcement = makeAnnouncement({
        tier: [i]
      });
      await announcementsRepository.create(announcement);
    }

    const response = await sut.execute({
      page: 1,
      limit: 10,
      tier: "1"
    });

    expect(response.list).toHaveLength(1);
  });

  it("should be able to filter the list of announcements by start date", async () => {
    for (let i = 0; i < 30; i++) {
      const announcement = makeAnnouncement({
        startDate: new Date(new Date().getTime() + i * 60 * 60 * 1000)
      });
      await announcementsRepository.create(announcement);
    }

    const response = await sut.execute({
      page: 1,
      limit: 10,
      startDate: new Date(new Date().getTime() + 25 * 59 * 60 * 1000)
    });

    expect(response.list).toHaveLength(5);
  });
});
