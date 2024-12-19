import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeGetPlayerActivityUseCase } from "../factories/task/make-get-player-activity-use-case";

const activitiesQuerySchema = z.object({
  limit: z.number().default(10),
  page: z.number().default(1),
  username: z.string().optional()
});

export class GetPlayerActivityController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      console.log("query params: " + JSON.stringify(req.query));
      const queryParams = activitiesQuerySchema.parse(req.query);
      const sut = makeGetPlayerActivityUseCase();
      const response = await sut.execute(queryParams);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Get Player Activity controller error`, err);
      return res.status(400).send("error while retrieving user activities");
    }
  }
}