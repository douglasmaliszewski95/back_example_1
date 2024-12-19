import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { makeClaimRewardPlayerUseCase } from "../factories/rewards/make-claim-reward-player-use-case";
import { z } from "zod";

const rewardRequest = z.object({
  reward: z.string()
});

export class ClaimRewardPlayerController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
      const currentToken = accessToken.split(" ");
      const token = currentToken[1];
      const { reward } = rewardRequest.parse(req.body);
      const sut = makeClaimRewardPlayerUseCase();
      const response = await sut.execute(reward, token);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("claim reward player controler error", err);
      return res.status(401).send(err);
    }
  };
}
