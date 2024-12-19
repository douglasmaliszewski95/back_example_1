import { beforeEach, describe, expect, it } from 'vitest';
import { SeasonsRepositoryInMemory } from '../../../../../../tests/repository/seasons-repository-in-memory';
import { CreateSeasonUseCase } from '../create-season-use-case';
import { makeSeason } from '../../../../../../tests/factories/make-season';
import { HttpException } from '../../../../../core/errors/HttpException';

let seasonsRepository: SeasonsRepositoryInMemory;
let sut: CreateSeasonUseCase;

describe("Create a season", () => {
  beforeEach(() => {
    seasonsRepository = new SeasonsRepositoryInMemory();
    sut = new CreateSeasonUseCase(seasonsRepository);
  });

  it("should not be able to create a season if startAt is in the past", async () => {
    const pastDate = new Date(new Date().getTime() - (60 * 60 * 1000));
    const futureDate = new Date(new Date().getTime() + (60 * 60 * 1000));

    await expect(sut.execute({
      name: "Past Season",
      description: "This season starts in the past",
      startAt: pastDate,
      endAt: futureDate,
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("should not be able to create a season if there is an overlapping season", async () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (60 * 60 * 1000));

    await seasonsRepository.create(makeSeason({
      id: 1,
      name: "Existing Season",
      description: "An existing season",
      startAt: now,
      endAt: futureDate,
      active: false
    }));

    await expect(sut.execute({
      name: "Overlapping Season",
      description: "This season overlaps with an existing season",
      startAt: now,
      endAt: futureDate,
    })).rejects.toBeInstanceOf(HttpException);
  });

  it("should create a season", async () => {
    const futureStart = new Date(new Date().getTime() + (60 * 60 * 1000));
    const futureEnd = new Date(futureStart.getTime() + (60 * 60 * 1000));

    const season = await sut.execute({
      name: "Valid Season",
      description: "This season does not overlap with any existing season",
      startAt: futureStart,
      endAt: futureEnd,
    });

    expect(season).toHaveProperty('id');
    expect(season.name).toBe("Valid Season");
  });
});