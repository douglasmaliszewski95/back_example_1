import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeDeletePlayerUsecase } from "../factories/user/make-delete-player-use-case";

const deletePlayerSchema = z.object({
  providerPlayerId: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
});

export class DeletePlayerController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { providerPlayerId, username, email } = deletePlayerSchema.parse(req.query);
      const sut = makeDeletePlayerUsecase();
      await sut.execute(providerPlayerId, username, email);
      return res.status(200).send("player deleted");
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Delete player controler error", err);
      return res.status(400).send("error while deleting player");
    }
  }
}