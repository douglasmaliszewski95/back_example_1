import { CreateSeasonUseCase } from "../../../../../domain/season/application/use-cases/create-season-use-case";
import { PrismaSeasonsRepository } from "../../../../database/prisma-repositories/prisma-seasons-repository";

export function makeCreateSeasonUseCase() {
  const seasonRepository = new PrismaSeasonsRepository();
  const sut = new CreateSeasonUseCase(seasonRepository);
  return sut;
}
