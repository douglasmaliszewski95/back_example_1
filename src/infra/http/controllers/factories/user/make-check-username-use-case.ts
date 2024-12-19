import { CheckUsernameUseCase } from "../../../../../domain/user/application/use-cases/user/check-username-use-case";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeCheckUsernameUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const sut = new CheckUsernameUseCase(playersRepository);
  return sut;
} 