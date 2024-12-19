import { CreateSystemUseCase } from "../../../../../domain/system/application/use-cases/create-system-usecase";
import { UpdateSystemUseCase } from "../../../../../domain/system/application/use-cases/update-system-usecase";
import { PrismaSystemRepository } from "../../../../database/prisma-repositories/prisma-system-repository";

export function makeUpdateSystemUsecase() {
  const repository = new PrismaSystemRepository();
  const sut = new UpdateSystemUseCase(repository);
  return sut;
}
