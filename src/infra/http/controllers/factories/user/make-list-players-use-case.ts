import { ListPlayersUseCase } from "../../../../../domain/user/application/use-cases/user/list-players-use-case";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PrismaSystemRepository } from "../../../../database/prisma-repositories/prisma-system-repository";

export function makeListPlayersUseCase() {
  const repository = new PrismaPlayersRepository();
  const systemsRepository = new PrismaSystemRepository();
  const sut = new ListPlayersUseCase(repository, systemsRepository);
  return sut;
}