
import sizeOf from 'image-size';
import { PlayersRepository } from '../../repositories/players-repository';
import { Player } from '../../../enterprise/entities/player';
import { HttpStatus } from '../../../../../core/errors/http-status';
import { HttpException } from '../../../../../core/errors/HttpException';
import { FileStorage } from '../../../../announcement/application/storage/file-storage';

interface UploadPlayerAvatarRequestDTO {
  fileName: string;
  fileType: string;
  buffer: Buffer;
}

interface UploadPlayerAvatarResponseDTO {
  player: Player
}

export class UploadPlayerAvatarUseCase {
  constructor(private playersRepository: PlayersRepository, private fileStorage: FileStorage) { }

  execute = async (providerPlayerId: string, data: UploadPlayerAvatarRequestDTO): Promise<UploadPlayerAvatarResponseDTO> => {
    if (!/^(image\/(jpeg|png|jpg))$/.test(data.fileType)) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid file type");
    const dimensions = sizeOf(data.buffer);
    if (dimensions.width && dimensions.width > 500 && dimensions.height && dimensions.height > 500) throw new HttpException(HttpStatus.NOT_ACCEPTABLE, "invalid image dimensions");

    const player = await this.playersRepository.findPlayerByProviderId(providerPlayerId);
    if (!player) throw new HttpException(HttpStatus.NOT_FOUND, "player not found");
    const { url } = await this.fileStorage.upload({
      body: data.buffer,
      fileName: data.fileName,
      fileType: data.fileType
    });

    if (!url) throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Failed to upload avatar");
    const playerWithAvatar = await this.playersRepository.attachAvatar(providerPlayerId, url);
    if (player.avatarUrl) await this.fileStorage.delete(player.avatarUrl);

    return {
      player: playerWithAvatar
    };
  }
}