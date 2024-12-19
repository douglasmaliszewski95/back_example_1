import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeRefreshPlayerTokenUseCase } from "../factories/user/make-refresh-player-token-use-case";

const refreshTokenSchema = z.object({
  refreshToken: z.string()
})

export class RefreshPlayerTokenController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const payload = refreshTokenSchema.parse(req.body);
      const sut = makeRefreshPlayerTokenUseCase();
      const response = await sut.execute(payload);

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Refresh player token controler error", err);
      return res.status(400).send(err);
    }
  }
}