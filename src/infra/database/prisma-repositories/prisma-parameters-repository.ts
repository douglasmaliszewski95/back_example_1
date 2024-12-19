import { prisma } from "../prisma";
import { ParametersRepository } from "../../../domain/parameters/application/repositories/parameters-repository";
import { PrismaParametersMapper } from "../mappers/prisma-parameters-mapper";
import { Parameters } from "../../../domain/parameters/enterprise/entities/parameters";

export class PrismaParametersRepository implements ParametersRepository {
  async create(data: Parameters): Promise<Parameters> {
    const parameter = await prisma.parameters.create({
      data: PrismaParametersMapper.toPrisma(data)
    });

    return PrismaParametersMapper.toEntity(parameter);
  }

  async updateTokenGalxe(
    id: number, 
    refreshTokenGalxe: string, 
    refreshToken: string, 
    playerId: string
  ): Promise<Parameters> {
    const parameter = await prisma.parameters.update({
      where: {
        id
      },
      data: {
        refreshTokenGalxe,
        refreshToken,
        userId: playerId
      }
    });

    return PrismaParametersMapper.toEntity(parameter);
  }

  async findParameterById(uuid: string): Promise<Parameters | null> {
    const parameter = await prisma.parameters.findFirst({
      where: {
        userId: uuid
      }
    });

    if (!parameter) return null;

    return PrismaParametersMapper.toEntity(parameter);
  }

  async findParameterByGalxeId(galxeId: string): Promise<Parameters | null> {
    const parameter = await prisma.parameters.findFirst({
      where: {
        galxeId
      }
    });

    if (!parameter) return null;

    return PrismaParametersMapper.toEntity(parameter);
  }

  async list(): Promise<Parameters[]> {
    const parameters = await prisma.parameters.findMany();

    const paramMap = parameters.map(x => {
      return PrismaParametersMapper.toEntity(x);
    })

    return paramMap;
  }
}
