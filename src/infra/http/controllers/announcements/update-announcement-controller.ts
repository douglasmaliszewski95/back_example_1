import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z, ZodError } from "zod";
import { makeUpdateAnnouncementUseCase } from "../factories/announcements/make-update-announcement-use-case";
import { stripHtml } from "../parsers/parsers";

const updateBodySchema = z.object({
  title: z.string().max(50, "limit of 50 characters for title").optional(),
  message: z.string().refine(
    (msg) => stripHtml(msg).length <= 400,
    { message: "limit of 400 characters for content" }
  ).optional(),
  tier: z.array(z.number()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
});

const updateParamsSchema = z.object({
  id: z.coerce.number()
});

export class UpdateAnnouncementController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const body = updateBodySchema.parse(req.body);
      const { id } = updateParamsSchema.parse(req.params);
      const sut = makeUpdateAnnouncementUseCase();
      const response = await sut.execute(id, body);
      return res.status(201).send(response);
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).send(err.errors);
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Update announcement controller error`, err);
      return res.status(400).send("error while updating announcement");
    }
  };
}
