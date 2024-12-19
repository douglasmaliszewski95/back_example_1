import { FastifyRequest, FastifyReply } from "fastify";
import { makeUploadAnnouncementBannerUseCase } from "../factories/announcements/make-upload-announcement-banner-use-case";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { z } from "zod";

const uploadBannerSchema = z.object({
  id: z.coerce.number(),
});

export class UploadAnnouncementController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { id } = uploadBannerSchema.parse(req.params);
      const data = await req.file();
      if (!data) throw new HttpException(HttpStatus.NOT_FOUND, "File not found");
      const sut = makeUploadAnnouncementBannerUseCase();
      const response = await sut.execute(id, {
        buffer: await data.toBuffer(),
        fileName: data.filename,
        fileType: data.mimetype
      });

      return res.status(200).send(response.announcement);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`upload announcement banner controller error`, err);
      return res.status(400).send("error while uploading announcement banner");
    }
  }
}