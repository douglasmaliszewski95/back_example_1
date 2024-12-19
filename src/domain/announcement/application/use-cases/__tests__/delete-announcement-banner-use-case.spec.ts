import { beforeEach, describe, expect, it } from 'vitest';
import { FakeFileStorage } from '../../../../../../tests/storage/fake-file-storage';
import { AnnoucementsRepositoryInMemory } from '../../../../../../tests/repository/announcements-repository-in-memory';
import { makeAnnouncement } from '../../../../../../tests/factories/make-announcement';
import { HttpException } from '../../../../../core/errors/HttpException';
import path from 'path';
import fs from 'fs'
import { DeleteAnnouncementBannerUseCase } from '../delete-announcement-banner-use-case';

let announcementsRepository: AnnoucementsRepositoryInMemory;
let fileStorage: FakeFileStorage;
let sut: DeleteAnnouncementBannerUseCase;

describe("Delete announcement banner", () => {
  beforeEach(() => {
    announcementsRepository = new AnnoucementsRepositoryInMemory();
    fileStorage = new FakeFileStorage();
    sut = new DeleteAnnouncementBannerUseCase(announcementsRepository, fileStorage);
  });

  it("should be able to delete a banner of an announcement", async () => {
    const buffer = fs.readFileSync(path.join(__dirname, 'banner-test.png'));
    const { url } = await fileStorage.upload({
      body: buffer,
      fileName: 'banner-url.com/banner.png',
      fileType: 'image/png',
    });

    const announcement = makeAnnouncement({
      bannerExtension: "image/png",
      bannerUrl: url
    });
    const createdAnnouncement = await announcementsRepository.create(announcement);
    await sut.execute(createdAnnouncement.id ?? 0);
    expect(fileStorage.uploads.length).toEqual(0);
  });
});