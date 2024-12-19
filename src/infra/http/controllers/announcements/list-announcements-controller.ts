import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeListAnnouncementsUseCase } from "../factories/announcements/make-list-announcements-use-case";

const listSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  title: z.string().optional(),
  tier: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export class ListAnnouncementsController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const params = listSchema.parse(req.query);
      const sut = makeListAnnouncementsUseCase();
      const response = await sut.execute(params);
      return res.status(201).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`List announcements controller error`, err);
      return res.status(400).send("error while listing announcements");
    }
  }
}