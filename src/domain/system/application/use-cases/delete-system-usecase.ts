import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { SystemRepository } from "../repositories/system-repository";

export class DeleteSystemUseCase {
  constructor(private systemRepository: SystemRepository) { }

  async execute(systemId: number) {
    const existentSystem = await this.systemRepository.getById(systemId);
    if (!existentSystem) throw new HttpException(HttpStatus.NOT_FOUND, "System not found");
    if (existentSystem.status !== "PENDING") throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Cannot delete a system that is not pending");
    await this.systemRepository.remove(systemId);
  }
}
