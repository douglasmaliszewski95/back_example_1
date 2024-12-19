import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { Parameters } from "../../enterprise/entities/parameters";
import { ParametersRepository } from "../repositories/parameters-repository";

export class CreateParameterUseCase {
  constructor(private parametersRepository: ParametersRepository) { }

  execute = async (data: Parameters): Promise<Parameters> => {
    const createParameters = await this.parametersRepository.create(data)
    if (!createParameters) throw new HttpException(HttpStatus.BAD_REQUEST, "Error while creating parameter");
    
    return createParameters;
  };
}
