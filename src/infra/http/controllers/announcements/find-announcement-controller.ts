import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeFindAnnouncementUseCase } from "../factories/announcements/make-find-announcement-use-case";

const findSchema = z.object({
  id: z.coerce.number(),
})

export class FindAnnouncementController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { id } = findSchema.parse(req.params);
      const sut = makeFindAnnouncementUseCase();
      const response = await sut.execute(id);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Find annoucement controller error`, err);
      return res.status(400).send("error while finding announcement");
    }
  }
}