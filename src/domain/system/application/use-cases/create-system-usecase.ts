import { v4 as uuidv4 } from "uuid";
import { SystemRepository } from "../repositories/system-repository";
import { System } from "../../enterprise/entities/system";

interface CreateSystemInputDto {
  description: string;
  name: string;
}

export class CreateSystemUseCase {
  constructor(private systemRepository: SystemRepository) {}

  async execute(system: CreateSystemInputDto) {
    await this.systemRepository.create(
      System.create({
        description: system.description,
        name: system.name,
        systemId: uuidv4()
      })
    );
  }
}
