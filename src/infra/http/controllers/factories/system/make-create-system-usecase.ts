import { CreateSystemUseCase } from "../../../../../domain/system/application/use-cases/create-system-usecase";
import { PrismaSystemRepository } from "../../../../database/prisma-repositories/prisma-system-repository";

export function makeCreateSystemUsecase() {
  const repository = new PrismaSystemRepository();
  const sut = new CreateSystemUseCase(repository);
  return sut;
}
