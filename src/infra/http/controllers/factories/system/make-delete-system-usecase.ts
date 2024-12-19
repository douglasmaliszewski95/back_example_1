import { DeleteSystemUseCase } from "../../../../../domain/system/application/use-cases/delete-system-usecase";
import { PrismaSystemRepository } from "../../../../database/prisma-repositories/prisma-system-repository";

export function makeDeleteSystemUsecase() {
  const repository = new PrismaSystemRepository();
  const sut = new DeleteSystemUseCase(repository);
  return sut;
}
