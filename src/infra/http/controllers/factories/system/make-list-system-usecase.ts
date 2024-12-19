import { ListSystemUseCase } from "../../../../../domain/system/application/use-cases/list-system-usecase";
import { PrismaSystemRepository } from "../../../../database/prisma-repositories/prisma-system-repository";

export function makeListSystemUsecase() {
  const repository = new PrismaSystemRepository();
  const sut = new ListSystemUseCase(repository);
  return sut;
}
