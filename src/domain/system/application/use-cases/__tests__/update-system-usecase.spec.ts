import { beforeEach, describe, expect, it } from "vitest";
import { SystemRepository } from "../../repositories/system-repository";
import {
  mockedPendingSystem,
  SystemRepositoryInMemory
} from "../../../../../../tests/repository/system-repository-in-memory";
import { System, SYSTEM_STATUS } from "../../../enterprise/entities/system";
import { makeSystem } from "../../../../../../tests/factories/make-system";
import { UpdateSystemUseCase } from "../update-system-usecase";
import { PrismaSystemMapper } from "../../../../../infra/database/mappers/prisma-system-mapper";
import { HttpException } from "../../../../../core/errors/HttpException";

let systemRepository: SystemRepository;
let sut: UpdateSystemUseCase;

describe("Update system use case", () => {
  beforeEach(() => {
    systemRepository = new SystemRepositoryInMemory();
    sut = new UpdateSystemUseCase(systemRepository);
  });

  it("Should update system without update systemId", async () => {
    const payload: System = makeSystem({
      id: mockedPendingSystem.id as number
    });
    await sut.execute({
      id: payload.id as number,
      status: payload.status as SYSTEM_STATUS,
      ...PrismaSystemMapper.toPrisma(payload)
    });
    const updated = await systemRepository.getById(payload.id as number);

    expect(updated?.description).toBe(payload.description);
    expect(updated?.name).toBe(payload.name);
    expect(updated?.systemId).toBe(mockedPendingSystem.systemId);
  });

  it("Should not update system because it not exists", async () => {
    const payload: System = makeSystem({
      id: 999
    });
    try {
      await sut.execute({
        id: payload.id as number,
        status: payload.status as SYSTEM_STATUS,
        ...PrismaSystemMapper.toPrisma(payload)
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it("Should not update system because STATUS cannot change from PENDING to another status", async () => {
    const payload: System = makeSystem({
      id: mockedPendingSystem.id as number,
      status: "ACTIVE"
    });
    try {
      await sut.execute({
        id: payload.id as number,
        status: payload.status as SYSTEM_STATUS,
        ...PrismaSystemMapper.toPrisma(payload)
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
