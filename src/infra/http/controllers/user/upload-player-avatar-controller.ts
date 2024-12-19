import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { z } from "zod";
import { makeUploadPlayerAvatarUseCase } from "../factories/user/make-upload-player-avatar-use-case";

const uploadBannerSchema = z.object({
  id: z.string(),
});

export class UploadPlayerAvatarController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { id } = uploadBannerSchema.parse(req.params);
      const data = await req.file();
      if (!data) throw new HttpException(HttpStatus.NOT_FOUND, "File not found");
      const sut = makeUploadPlayerAvatarUseCase();
      const response = await sut.execute(id, {
        buffer: await data?.toBuffer(),
        fileName: data?.filename,
        fileType: data?.mimetype
      });

      return res.status(200).send(response.player);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Upload player avatar controler error", err);
      return res.status(400).send("error while uploading player avatar");
    }
  }
}