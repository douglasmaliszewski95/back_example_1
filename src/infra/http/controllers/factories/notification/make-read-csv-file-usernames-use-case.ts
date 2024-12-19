import { ReadCsvFileUsernamesUseCase } from "../../../../../domain/notification/application/use-cases/read-csv-file-usernames-use-case";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeReadCsvFileUsernamesUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const sut = new ReadCsvFileUsernamesUseCase(playersRepository);
  return sut;
}
