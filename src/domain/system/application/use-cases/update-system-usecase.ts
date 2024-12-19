import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { SystemRepository } from "../repositories/system-repository";
import { UpdateSystemDTO } from "../repositories/system-repository-types";

export class UpdateSystemUseCase {
  constructor(private systemRepository: SystemRepository) { }

  async execute(updatePayload: UpdateSystemDTO) {
    const existentSystem = await this.systemRepository.getById(updatePayload.id);
    if (!existentSystem) throw new HttpException(HttpStatus.NOT_FOUND, "System not found");

    if (existentSystem.status === "PENDING" && updatePayload.status !== "PENDING")
      throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Cannot change status from PENDING to another status");

    await this.systemRepository.update(updatePayload);
  }
}
