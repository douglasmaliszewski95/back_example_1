import { beforeEach, describe, expect, it } from 'vitest';
import { AnnoucementsRepositoryInMemory } from '../../../../../../tests/repository/announcements-repository-in-memory';
import { FindAnnouncementUseCase } from '../find-announcement-use-case';
import { makeAnnouncement } from '../../../../../../tests/factories/make-announcement';
import { HttpException } from '../../../../../core/errors/HttpException';

let announcementsRepository: AnnoucementsRepositoryInMemory;
let sut: FindAnnouncementUseCase;

describe("Create announcement", () => {
  beforeEach(() => {
    announcementsRepository = new AnnoucementsRepositoryInMemory();
    sut = new FindAnnouncementUseCase(announcementsRepository);
  });

  it("should be able to find announcement by id", async () => {
    const payload = makeAnnouncement();
    const announcement = await announcementsRepository.create(payload);
    const response = await sut.execute(announcement.id ?? 0);
    expect(response.message).toEqual(announcement.message);
    expect(response.title).toEqual(announcement.title);
  });

  it("should not be able to find announcement with invalid id", async () => {
    await expect(sut.execute(0)).rejects.toBeInstanceOf(HttpException)
  });
})