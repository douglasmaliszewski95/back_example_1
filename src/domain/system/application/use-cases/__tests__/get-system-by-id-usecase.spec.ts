import { beforeEach, describe, expect, it } from "vitest";
import { SystemRepository } from "../../repositories/system-repository";
import {
  mockedActiveSystem,
  mockedPendingSystem,
  SystemRepositoryInMemory
} from "../../../../../../tests/repository/system-repository-in-memory";
import { GetSystemByIdUseCase } from "../get-system-by-id-usecase";
import { HttpException } from "../../../../../core/errors/HttpException";

let systemRepository: SystemRepository;
let sut: GetSystemByIdUseCase;

describe("Get system by id use case", () => {
  beforeEach(() => {
    systemRepository = new SystemRepositoryInMemory();
    sut = new GetSystemByIdUseCase(systemRepository);
  });

  it("Should get the default pending system", async () => {
    const system = await sut.execute(mockedPendingSystem.id as number);

    expect(system.name).toBe(mockedPendingSystem.name);
  });

  it("Should get the default active system", async () => {
    const system = await sut.execute(mockedActiveSystem.id as number);

    expect(system.name).toBe(mockedActiveSystem.name);
  });

  it("Should not get any system because it not exists", async () => {
    await expect(sut.execute(999)).rejects.toBeInstanceOf(HttpException)
  });
});
