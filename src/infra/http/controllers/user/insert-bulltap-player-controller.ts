import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeInsertBulltapPlayerUseCase } from "../factories/user/make-insert-bulltap-player-use-case";

const bulltapRequest = z.object({
  email: z.string(),
  telegramId: z.string(),
  system: z.string()
});

export class InsertBulltapPlayerController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { email, telegramId, system } = bulltapRequest.parse(req.body);
      const sut = makeInsertBulltapPlayerUseCase();
      const response = await sut.execute(email, telegramId, system);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("insert bulltap player controler error", err);
      return res.status(401).send(err);
    }
  };
}
