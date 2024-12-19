import { beforeEach, describe, expect, it } from 'vitest';
import { FakeFileStorage } from '../../../../../../tests/storage/fake-file-storage';
import { AnnoucementsRepositoryInMemory } from '../../../../../../tests/repository/announcements-repository-in-memory';
import { UploadAnnouncementBannerUseCase } from '../upload-announcement-banner-use-case';
import { makeAnnouncement } from '../../../../../../tests/factories/make-announcement';
import { HttpException } from '../../../../../core/errors/HttpException';
import path from 'path';
import fs from 'fs'

let announcementsRepository: AnnoucementsRepositoryInMemory;
let fileStorage: FakeFileStorage;
let sut: UploadAnnouncementBannerUseCase;

describe("Update announcement", () => {
  beforeEach(() => {
    announcementsRepository = new AnnoucementsRepositoryInMemory();
    fileStorage = new FakeFileStorage();
    sut = new UploadAnnouncementBannerUseCase(announcementsRepository, fileStorage);
  });

  it("should be able to upload and attach a banner to an announcement", async () => {
    const announcement = makeAnnouncement();
    await announcementsRepository.create(announcement);
    const buffer = fs.readFileSync(path.join(__dirname, 'banner-test.png'));
    const response = await sut.execute(announcement.id ?? 1, {
      buffer: buffer,
      fileName: 'test.png',
      fileType: 'image/png',
    });

    expect(response.announcement.bannerExtension).toEqual('image/png');
  });

  it("should not be able to upload a file with invalid file type", async () => {
    const announcement = makeAnnouncement();
    await announcementsRepository.create(announcement);

    await expect(sut.execute(announcement.id ?? 1, {
      buffer: Buffer.from(''),
      fileName: 'test.png',
      fileType: 'audio/mpeg',
    })).rejects.toBeInstanceOf(HttpException);
  });
});