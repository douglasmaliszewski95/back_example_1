import { GetSystemByIdUseCase } from "../../../../../domain/system/application/use-cases/get-system-by-id-usecase";
import { PrismaSystemRepository } from "../../../../database/prisma-repositories/prisma-system-repository";

export function makeGetsystemById() {
  const repository = new PrismaSystemRepository();
  const sut = new GetSystemByIdUseCase(repository);
  return sut;
}
