import { beforeEach, describe, expect, it } from 'vitest';
import { makeAnnouncement } from "../../../../../../tests/factories/make-announcement";
import { AnnoucementsRepositoryInMemory } from "../../../../../../tests/repository/announcements-repository-in-memory";
import { HttpException } from "../../../../../core/errors/HttpException";
import { DeleteAnnouncementUseCase } from "../delete-announcement-use-case";

let announcementsRepository: AnnoucementsRepositoryInMemory;
let sut: DeleteAnnouncementUseCase;

describe("Delete announcement", () => {
  beforeEach(() => {
    announcementsRepository = new AnnoucementsRepositoryInMemory();
    sut = new DeleteAnnouncementUseCase(announcementsRepository);
  });

  it("should be able to delete a existing announcement", async () => {
    const announcement = await announcementsRepository.create(makeAnnouncement());

    await expect(sut.execute(announcement.id ?? 0)).not.toBeInstanceOf(HttpException)
  });

  it("should not be able to delete an announcement that not exists", async () => {
    await expect(sut.execute(0)).rejects.toBeInstanceOf(HttpException)
  });
});