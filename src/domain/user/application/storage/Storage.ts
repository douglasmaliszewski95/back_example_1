export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export interface Storage {
  upload(params: UploadParams): Promise<{ url: string }>
  delete(url: string): Promise<void>;
}