import { beforeEach, describe, expect, it } from "vitest";
import { SystemRepository } from "../../repositories/system-repository";
import {
  defaultSystemListCount,
  mockedActiveSystem,
  mockedPendingSystem,
  SystemRepositoryInMemory
} from "../../../../../../tests/repository/system-repository-in-memory";
import { DeleteSystemUseCase } from "../delete-system-usecase";
import { HttpException } from "../../../../../core/errors/HttpException";

let systemRepository: SystemRepository;
let sut: DeleteSystemUseCase;

describe("Create system use case", () => {
  beforeEach(() => {
    systemRepository = new SystemRepositoryInMemory();
    sut = new DeleteSystemUseCase(systemRepository);
  });

  it("Should delete system", async () => {
    await sut.execute(mockedPendingSystem.id as number);
    const systems = await systemRepository.list({ page: 1 });

    expect(systems.length).toBe(defaultSystemListCount - 1);
  });

  it("Should not delete system that not exists", async () => {
    const systems = await systemRepository.list({ page: 1 });
    try {
      await sut.execute(999);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
    expect(systems.length).toBe(defaultSystemListCount);
  });

  it("Should not delete because it is not pending", async () => {
    const systems = await systemRepository.list({ page: 1 });
    try {
      await sut.execute(mockedActiveSystem.id as number);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
    expect(systems.length).toBe(defaultSystemListCount);
  });
});
