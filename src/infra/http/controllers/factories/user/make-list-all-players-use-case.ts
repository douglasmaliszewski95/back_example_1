import { ListAllPlayersUseCase } from "../../../../../domain/user/application/use-cases/user/list-all-players-use-case";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export const makeListAllPlayersUseCase = () => {
  const playersRepository = new PrismaPlayersRepository();

  return new ListAllPlayersUseCase(playersRepository);
};
