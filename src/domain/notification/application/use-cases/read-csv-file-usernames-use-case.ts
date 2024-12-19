import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { Player } from "../../../user/enterprise/entities/player";
import { ReadCsvFile } from "../helpers/read-csv-file";

interface ReadCsvFileUsernamesRequestDTO {
  fileName: string;
  fileType: string;
  buffer: Buffer;
}

export class ReadCsvFileUsernamesUseCase {
  constructor(private playersRepository: PlayersRepository) {}

  execute = async (data: ReadCsvFileUsernamesRequestDTO): Promise<Player[]> => {
    if (!/^(text\/(csv))$/.test(data.fileType))
      throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid file type");
    const reader = new ReadCsvFile();
    const result = await reader.read(data.buffer);
    const players = await this.playersRepository.getPlayersByUserNameList(result);
    return players;
  };
}
