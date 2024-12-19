import { beforeEach, describe, expect, it } from "vitest";
import { AnnoucementsRepositoryInMemory } from "../../../../../../tests/repository/announcements-repository-in-memory";
import { AnnouncementVisualizationsRepositoryInMemory } from "../../../../../../tests/repository/announcement-visualizations-repository-in-memory";;
import { ListAnnouncementVisualizationsUseCase } from "../list-announcement-visualizations-use-case";
import { makeAnnouncement } from "../../../../../../tests/factories/make-announcement";
import { randomUUID } from "node:crypto";

let announcementsRepository: AnnoucementsRepositoryInMemory;
let announcementVisualizationsRepository: AnnouncementVisualizationsRepositoryInMemory;
let sut: ListAnnouncementVisualizationsUseCase;

describe("list announcement visualizations", () => {
  beforeEach(() => {
    announcementsRepository = new AnnoucementsRepositoryInMemory();
    announcementVisualizationsRepository = new AnnouncementVisualizationsRepositoryInMemory();
    sut = new ListAnnouncementVisualizationsUseCase(announcementsRepository, announcementVisualizationsRepository);
  });

  it("should be able to list paginated announcement visualizations", async () => {
    const announcement = await announcementsRepository.create(makeAnnouncement());
    for (let i = 0; i < 30; i++) {
      await announcementVisualizationsRepository.create({
        announcementId: announcement.id ?? 0,
        providerPlayerId: randomUUID()
      });
    }

    const response = await sut.execute(announcement.id ?? 0, {
      limit: 10,
      page: 1
    });

    expect(response.list.length).toEqual(10)
  });
});