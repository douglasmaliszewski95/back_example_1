import { prisma } from "../prisma";
import {
  ListSystemQueryParams,
  ReadSystemDTO,
  UpdateSystemDTO
} from "../../../domain/system/application/repositories/system-repository-types";
import { SystemRepository } from "../../../domain/system/application/repositories/system-repository";
import { System } from "../../../domain/system/enterprise/entities/system";
import { PrismaSystemMapper } from "../mappers/prisma-system-mapper";
import { Prisma, SYSTEM_STATUS } from "@prisma/client";

export class PrismaSystemRepository implements SystemRepository {
  async create(data: System) {
    await prisma.system.create({
      data: PrismaSystemMapper.toPrisma(data)
    });
  }

  async list(queryFilters: ListSystemQueryParams): Promise<ReadSystemDTO[]> {
    const skipCount = (queryFilters.page - 1) * (queryFilters.limit || 10);

    const filtersInput: Prisma.SystemWhereInput[] = [];
    let parsedStatus: SYSTEM_STATUS[] = [];

    if (queryFilters.status) {
      parsedStatus = queryFilters.status.split(",").map(status => status) as SYSTEM_STATUS[];
      filtersInput.push({
        status: {
          in: parsedStatus
        }
      })
    }

    const paginatedResponse = await prisma.system.findMany({
      take: queryFilters.limit,
      skip: skipCount,
      orderBy: {
        name: "asc"
      },
      where: {
        AND: [
          {
            description: {
              contains: queryFilters.description,
              mode: "insensitive"
            }
          },
          {
            name: {
              contains: queryFilters.name,
              mode: "insensitive"
            }
          },
          ...filtersInput
        ]
      },
      select: {
        description: true,
        name: true,
        systemId: true,
        id: true,
        status: true
      }
    });

    return paginatedResponse;
  }

  async count(queryFilters: ListSystemQueryParams): Promise<number> {
    const filtersInput: Prisma.SystemWhereInput[] = [];
    let parsedStatus: SYSTEM_STATUS[] = [];

    if (queryFilters.status) {
      parsedStatus = queryFilters.status.split(",").map(status => status) as SYSTEM_STATUS[];
      filtersInput.push({
        status: {
          in: parsedStatus
        }
      })
    }

    const paginatedResponse = await prisma.system.count({
      where: {
        AND: [
          {
            description: {
              contains: queryFilters.description,
              mode: "insensitive"
            }
          },
          {
            name: {
              contains: queryFilters.name,
              mode: "insensitive"
            }
          },
          ...filtersInput
        ]
      }
    });

    return paginatedResponse;
  }

  async remove(systemId: number) {
    await prisma.system.delete({
      where: {
        id: systemId
      }
    });
  }

  async update(data: UpdateSystemDTO) {
    await prisma.system.update({
      where: {
        id: data.id
      },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async getById(id: number): Promise<ReadSystemDTO | null> {
    const system = await prisma.system.findUnique({
      where: {
        id
      },
      select: {
        description: true,
        name: true,
        systemId: true,
        id: true,
        status: true
      }
    });

    return system;
  }

  async findBySystemId(systemId: string): Promise<System | null> {
    const system = await prisma.system.findFirst({
      where: {
        systemId
      }
    });

    if (!system) return null;

    return PrismaSystemMapper.toEntity(system);
  }
}
