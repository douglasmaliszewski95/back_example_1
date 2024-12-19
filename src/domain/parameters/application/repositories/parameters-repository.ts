import { Parameters } from "../../enterprise/entities/parameters";

export interface ParametersRepository {
  create(data: Parameters): Promise<Parameters>;
  updateTokenGalxe(
    id: number, 
    refreshTokenGalxe: string, 
    refreshToken: string, 
    playerId: string
  ): Promise<Parameters>;
  findParameterById(uuid: string): Promise<Parameters | null>;
  findParameterByGalxeId(galxeId: string): Promise<Parameters | null>;
  list(): Promise<Parameters[]>;
}
