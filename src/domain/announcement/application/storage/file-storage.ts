import { UploadParams } from "./file-storage.types";

export interface FileStorage {
  upload(params: UploadParams): Promise<{ url: string }>;
  delete(url: string): Promise<void>;
}