import { beforeEach, describe, expect, it } from "vitest";
import { AnnoucementsRepositoryInMemory } from "../../../../../../tests/repository/announcements-repository-in-memory";
import { HttpException } from "../../../../../core/errors/HttpException";
import { AnnouncementVisualizationsRepositoryInMemory } from "../../../../../../tests/repository/announcement-visualizations-repository-in-memory";
import { ReadAnnouncementUseCase } from "../read-announcement-use-case";
import { makeAnnouncement } from "../../../../../../tests/factories/make-announcement";
import { randomUUID } from "crypto";

let announcementsRepository: AnnoucementsRepositoryInMemory;
let announcementVisualizationsRepository: AnnouncementVisualizationsRepositoryInMemory;
let sut: ReadAnnouncementUseCase;

describe("read announcement", () => {
  beforeEach(() => {
    announcementsRepository = new AnnoucementsRepositoryInMemory();
    announcementVisualizationsRepository = new AnnouncementVisualizationsRepositoryInMemory();
    sut = new ReadAnnouncementUseCase(announcementsRepository, announcementVisualizationsRepository);
  });

  it("should be able to add a visualizations", async () => {
    const announcement = await announcementsRepository.create(makeAnnouncement());
    await sut.execute({
      announcementId: announcement.id ?? 0,
      providerPlayerId: randomUUID()
    });

    expect(announcementVisualizationsRepository.visualizations.length).toEqual(1)
  });

  it("should not be able to add a visualization to a not existing announcement", async () => {
    await expect(sut.execute({
      announcementId: 0,
      providerPlayerId: randomUUID()
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to add a visualization if it was previous added", async () => {
    const announcement = await announcementsRepository.create(makeAnnouncement());
    const providerPlayerId = randomUUID();
    await announcementVisualizationsRepository.create({
      announcementId: announcement.id ?? 0,
      providerPlayerId
    });

    expect(announcementVisualizationsRepository.visualizations.length).toEqual(1)
  });
});