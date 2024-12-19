import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeListAnnouncementVisualizationsUseCase } from "../factories/announcements/make-list-announcement-visualizations-use-case";

const listQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
});

const paramsSchema = z.object({
  id: z.number()
});

export class ListAnnouncementVisualizationsController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const query = listQuerySchema.parse(req.query);
      const { id } = paramsSchema.parse(req.params);
      const sut = makeListAnnouncementVisualizationsUseCase();
      const response = await sut.execute(id, query);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`List announcements visualization controller error`, err);
      return res.status(400).send("error while marking announcement as read");
    }
  }
}