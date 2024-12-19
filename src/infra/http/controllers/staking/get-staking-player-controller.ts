import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeGetStakingPlayerUseCase } from "../factories/staking/make-get-staking-player-use-case";
import { z } from "zod";

const getStakingSchema = z.object({
  wallet: z.string().optional()
});

export class GetStakingPlayerController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const schema = getStakingSchema.parse(req.query);
      const sut = makeGetStakingPlayerUseCase();
      const response = await sut.execute(schema.wallet ?? "");
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("get staking player controler error", err);
      return res.status(401).send(err);
    }
  };
}
