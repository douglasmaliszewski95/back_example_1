import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeRecalculateAllPlayersSeasonTierUseCase } from "../factories/season/make-recalculate-all-players-season-tier-use-case";

export class RecalculateAllPlayersSeasonTierController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      console.log('recalc of season tier cron triggered');
      const sut = makeRecalculateAllPlayersSeasonTierUseCase()
      await sut.execute();
      console.log('recalc of season tier cron finsished');

      return res.status(200).send("cron triggered");
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`recalculate tier controller error`, err);
      return res.status(400).send("error triggering cron");
    }
  }
}