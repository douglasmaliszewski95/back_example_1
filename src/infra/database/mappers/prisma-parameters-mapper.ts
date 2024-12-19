import { Prisma, Parameters as PrismaParameters } from "@prisma/client";
import { Parameters } from "../../../domain/parameters/enterprise/entities/parameters";

export class PrismaParametersMapper {
  static toPrisma(parameter: Parameters): Prisma.ParametersUncheckedCreateInput {
    return {
      termsAccepted: parameter.termsAccepted,
      galxeId: parameter.galxeId,
      userId: parameter.userId,
      refreshToken: parameter.refreshToken,
      refreshTokenGalxe: parameter.refreshTokenGalxe,
      inviteCode: parameter.inviteCode
    };
  }

  static toEntity(parameter: PrismaParameters): Parameters {
    return Parameters.create({
      id: parameter.id,
      userId: parameter.userId,
      galxeId: parameter.galxeId as string,
      termsAccepted: parameter.termsAccepted,
      refreshToken: parameter.refreshToken,
      refreshTokenGalxe: parameter.refreshTokenGalxe,
      createdAt: parameter.createdAt,
      inviteCode: parameter.inviteCode as string
    });
  }
}
