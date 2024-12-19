import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeCreateAnnouncementUseCase } from "../factories/announcements/make-create-announcement-use-case";
import { z, ZodError } from "zod";
import { stripHtml } from "../parsers/parsers";

const createAnnouncementSchema = z.object({
  tier: z.array(z.number()),
  title: z.string().max(50, "limit of 50 characters for title"),
  message: z.string().refine(
    (msg) => stripHtml(msg).length <= 400,
    { message: "limit of 400 characters for content" }
  ),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional()
});

export class CreateAnnouncementController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const payload = createAnnouncementSchema.parse(req.body);
      const sut = makeCreateAnnouncementUseCase();
      const response = await sut.execute(payload);
      return res.status(201).send(response.announcement);
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).send(err.errors);
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Create announcement controller error`, err);
      return res.status(400).send("error while creating announcement");
    }
  };
}
