import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeDeleteAnnouncementUseCase } from "../factories/announcements/make-delete-announcement-use-case";

const deleteSchema = z.object({
  id: z.coerce.number(),
})

export class DeleteAnnouncementController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { id } = deleteSchema.parse(req.params);
      const sut = makeDeleteAnnouncementUseCase();
      const response = await sut.execute(id);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Delete announcement controller error`, err);
      return res.status(400).send("error while deleting announcement");
    }
  }
}