import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeAllTimeLeaderboardsUseCase } from "../factories/season/make-all-time-leaderboards-use-case";

const listSchema = z.object({
  limit: z.number().default(10),
  page: z.number().default(0)
});

export class AllTimeLeaderboardsController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {

    try {
      const params = listSchema.parse(req.query);
      const sut = makeAllTimeLeaderboardsUseCase();
      const response = await sut.execute(params);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`All Time Leaderboards controller error`, err);
      return res.status(400).send("error while retrieving all time leaderboards");
    }
  }
}