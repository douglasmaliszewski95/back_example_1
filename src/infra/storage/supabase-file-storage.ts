import { PutObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Storage, UploadParams } from "../../domain/user/application/storage/Storage";
import { env } from "../env";
import { randomUUID } from "node:crypto";
import { HttpException } from "../../core/errors/HttpException";
import { HttpStatus } from "../../core/errors/http-status";

export class SupabaseFileStorage implements Storage {
  private client: S3Client

  constructor() {
    const accessKeyId = env.ACCESS_KEY_ID
    const secretAccessKey = env.SECRET_ACCESS_KEY

    this.client = new S3Client({
      endpoint: env.STORAGE_URL,
      region: env.BUCKET_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  async upload(params: UploadParams): Promise<{ url: string; }> {
    const { body, fileName, fileType } = params

    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: env.BUCKET_NAME,
          Key: uniqueFileName,
          ContentType: fileType,
          Body: body,
        })
      );

      return {
        url: `${env.STORAGE_IMAGE_URL}/${env.BUCKET_NAME}/${uniqueFileName}`,
      }
    } catch (err) {
      throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while uploading file");
    }
  }

  async delete(url: string): Promise<void> {
    try {
      const key = url.split(env.STORAGE_IMAGE_URL + "/" + env.BUCKET_NAME + "/")[1];
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: env.BUCKET_NAME,
          Key: key
        })
      )
    } catch (err) {
      throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while deleting file");
    }
  }
}