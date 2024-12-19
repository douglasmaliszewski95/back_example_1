import { FindPlayerByIdUseCase } from "../../../../../domain/user/application/use-cases/user/find-player-by-id-use-case";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PrismaSystemRepository } from "../../../../database/prisma-repositories/prisma-system-repository";

export function makeFindPlayerByIdUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const systemsRepository = new PrismaSystemRepository();
  const sut = new FindPlayerByIdUseCase(playersRepository, systemsRepository);
  return sut;
}