import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { Season } from "../../enterprise/entities/season";
import { SeasonsRepository } from "../repositories/seasons-repository";

interface CreateSeasonUseCaseRequestDTO {
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;
}

export class CreateSeasonUseCase {
  constructor(private seasonsRepository: SeasonsRepository) {}

  execute = async (data: CreateSeasonUseCaseRequestDTO) => {
    const currentDate = new Date();

    if (data.startAt < currentDate) {
      throw new HttpException(HttpStatus.BAD_REQUEST, "The start date cannot be in the past.");
    }

    const overlappingSeason = await this.seasonsRepository.findOverlappingSeason(data.startAt, data.endAt);
    if (overlappingSeason) {
      throw new HttpException(HttpStatus.BAD_REQUEST, "There is already a season active during the given time frame.");
    }

    const season = Season.create({
      ...data,
      active: false
    });

    const savedSeason = await this.seasonsRepository.create(season);

    return savedSeason;
  };
}
