import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeCreateSeasonUseCase } from "../factories/season/make-create-season-use-case";

const createSeasonSchema = z.object({
  name: z.string(),
  description: z.string(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date()
});

export class CreateSeasonController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const body = createSeasonSchema.parse(req.body);
      const sut = makeCreateSeasonUseCase();
      const response = await sut.execute(body);
      return res.status(201).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      return res.status(400).send("error while creating new season");
    }
  }
}