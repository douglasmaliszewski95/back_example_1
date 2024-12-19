import { beforeEach, describe, expect, it } from "vitest";
import { SystemRepository } from "../../repositories/system-repository";
import { CreateSystemUseCase } from "../create-system-usecase";
import { SystemRepositoryInMemory } from "../../../../../../tests/repository/system-repository-in-memory";
import { System } from "../../../enterprise/entities/system";
import { makeSystem } from "../../../../../../tests/factories/make-system";

let systemRepository: SystemRepository;
let sut: CreateSystemUseCase;

describe("Create system use case", () => {
  beforeEach(() => {
    systemRepository = new SystemRepositoryInMemory();
    sut = new CreateSystemUseCase(systemRepository);
  });

  it("Should create system", async () => {
    const payload: System = makeSystem();
    sut.execute(payload);

    const systems = await systemRepository.list({ page: 1 });

    const cretedSystem = systems.find(system => system.name === payload.name);

    expect(cretedSystem).toBeDefined();
  });
});
