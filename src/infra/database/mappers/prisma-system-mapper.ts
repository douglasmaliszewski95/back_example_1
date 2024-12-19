import { System } from "../../../domain/system/enterprise/entities/system";
import { System as PrismaSystem, Prisma } from "@prisma/client";

export class PrismaSystemMapper {
  static toEntity(prisma: PrismaSystem): System {
    return System.create({
      name: prisma.name,
      description: prisma.description,
      systemId: prisma.systemId,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
      id: prisma.id,
      status: prisma.status
    });
  }

  static toPrisma(entity: System): Prisma.SystemCreateInput {
    return {
      name: entity.name,
      description: entity.description,
      systemId: entity.systemId,
      status: entity.status
    };
  }
}
