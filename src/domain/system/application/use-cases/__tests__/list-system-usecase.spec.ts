import { beforeEach, describe, expect, it } from "vitest";
import { SystemRepository } from "../../repositories/system-repository";
import {
  mockedPendingSystem,
  SystemRepositoryInMemory,
  defaultSystemListCount
} from "../../../../../../tests/repository/system-repository-in-memory";
import { ListSystemUseCase } from "../list-system-usecase";

let systemRepository: SystemRepository;
let sut: ListSystemUseCase;

describe("List system use case", () => {
  beforeEach(() => {
    systemRepository = new SystemRepositoryInMemory();
    sut = new ListSystemUseCase(systemRepository);
  });

  it("should list all systems", async () => {
    const response = await sut.execute({ page: 1 });

    expect(response.total).toBe(defaultSystemListCount);
    expect(response.list.length).toBe(defaultSystemListCount);
  });

  it("should not list systems", async () => {
    const response = await sut.execute({ page: 1, name: "not existent system" });

    expect(response.list.length).toBe(0);
    expect(response.total).toBe(0);
  });

  it("should list the default system", async () => {
    const response = await sut.execute({ page: 1, name: mockedPendingSystem.name });

    expect(response.total).toBe(defaultSystemListCount - 1);
    expect(response.list.length).toBe(defaultSystemListCount - 1);
  });
});
