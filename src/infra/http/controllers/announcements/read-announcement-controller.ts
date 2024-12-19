import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeReadAnnouncementUseCase } from "../factories/announcements/make-read-announcement-use-case";
import { z } from "zod";

const bodySchema = z.object({
  announcementId: z.number(),
  providerPlayerId: z.string(),
});

export class ReadAnnouncementController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const body = bodySchema.parse(req.body);
      const sut = makeReadAnnouncementUseCase();
      const response = await sut.execute(body);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Read Announcement controller error`, err);
      return res.status(400).send("error while marking announcement as read");
    }
  }
}