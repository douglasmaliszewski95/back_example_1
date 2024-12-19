import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeListSystemUsecase } from "../factories/system/make-list-system-usecase";
import { z } from "zod";
import { SYSTEM_STATUS } from "../../../../domain/system/enterprise/entities/system";

const schema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z
    .string()
    .optional()
});

export class ListSystemController {
  async handle(req: FastifyRequest, res: FastifyReply) {
    try {
      const queryParams = schema.parse(req.query);
      const sut = makeListSystemUsecase();
      const response = await sut.execute({
        ...queryParams,
        status: queryParams.status as SYSTEM_STATUS
      });

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Listing System controller error`, err);
      return res.status(400).send("error while listing systems");
    }
  }
}
