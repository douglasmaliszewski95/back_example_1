import { beforeEach, describe, expect, it } from 'vitest';
import { AnnoucementsRepositoryInMemory } from '../../../../../../tests/repository/announcements-repository-in-memory';
import { UpdateAnnouncementUseCase } from '../update-announcement-use-case';
import { makeAnnouncement } from '../../../../../../tests/factories/make-announcement';
import { HttpException } from '../../../../../core/errors/HttpException';

let announcementsRepository: AnnoucementsRepositoryInMemory;
let sut: UpdateAnnouncementUseCase;

describe("Update announcement", () => {
  beforeEach(() => {
    announcementsRepository = new AnnoucementsRepositoryInMemory();
    sut = new UpdateAnnouncementUseCase(announcementsRepository);
  });

  it("should be able to update an announcement", async () => {
    const announcement = await announcementsRepository.create(makeAnnouncement());
    const response = await sut.execute(announcement.id ?? 0, {
      message: "test-message",
    });

    expect(response.announcement.message).toEqual("test-message");
  });

  it("should not be able to update an announcement with invalid arguments", async () => {
    await expect(sut.execute(0, {
      message: "test-message",
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("shuold not be able to update an annoucement with invalid start date", async () => {
    await expect(sut.execute(0, {
      startDate: new Date(new Date().getTime() - (1 * 60 * 60 * 1000)),
      endDate: new Date()
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("shuold not be able to update an annoucement with invalid end date", async () => {
    await expect(sut.execute(0, {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() - (1 * 60 * 60 * 1000)),
    })).rejects.toBeInstanceOf(HttpException);
  });
});