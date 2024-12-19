import { randomUUID } from 'node:crypto'
import { FileStorage } from '../../src/domain/announcement/application/storage/file-storage'
import { UploadParams } from '../../src/domain/user/application/storage/Storage'

interface Upload {
  buffer?: Buffer;
  fileName: string
  url: string
}

export class FakeFileStorage implements FileStorage {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }

  async delete(url: string): Promise<void> {
    const urlIndex = await this.uploads.findIndex(item => item.url === url);
    await this.uploads.splice(urlIndex, 1);
  }
}