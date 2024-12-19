import { beforeEach, describe, expect, it } from "vitest";
import { AnnoucementsRepositoryInMemory } from "../../../../../../tests/repository/announcements-repository-in-memory";
import { HttpException } from "../../../../../core/errors/HttpException";
import { CreateAnnouncementUseCase } from "../create-announcement-use-case";

let announcementsRepository: AnnoucementsRepositoryInMemory;
let sut: CreateAnnouncementUseCase;

describe("Create announcement", () => {
  beforeEach(() => {
    announcementsRepository = new AnnoucementsRepositoryInMemory();
    sut = new CreateAnnouncementUseCase(announcementsRepository);
  });

  it("should be able to create a announcement", async () => {
    const response = await sut.execute({
      message: "test-message",
      tier: [1, 2],
      title: "test-title",
      startDate: new Date(new Date().getTime() + 60 * 1000),
      endDate: new Date(new Date().getTime() + 1 * 60 * 60 * 1000)
    });

    expect(response.announcement.message).toEqual("test-message");
    expect(response.announcement.title).toEqual("test-title");
    expect(response.announcement.tier).toEqual([1, 2]);
  });

  it("should not be able to create a announcement with a invalid start date", async () => {
    await expect(
      sut.execute({
        message: "test-message",
        tier: [1, 2],
        title: "test-title",
        startDate: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
        endDate: new Date()
      })
    ).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to create a announcement with a invalid end date", async () => {
    await expect(
      sut.execute({
        message: "test-message",
        tier: [1, 2],
        title: "test-title",
        startDate: new Date(),
        endDate: new Date(new Date().getTime() - 1 * 60 * 60 * 1000)
      })
    ).rejects.toBeInstanceOf(HttpException);
  });
});
