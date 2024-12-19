import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { SystemRepository } from "../repositories/system-repository";

export class GetSystemByIdUseCase {
  constructor(private systemRepository: SystemRepository) { }

  async execute(systemId: number) {
    const system = await this.systemRepository.getById(systemId);
    if (!system) throw new HttpException(HttpStatus.NOT_FOUND, "System not found");

    return system;
  }
}
