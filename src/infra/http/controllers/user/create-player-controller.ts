import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { PlayerPresenter } from "../../presenters/player-presenter";
import { makeCreatePlayerUseCase } from "../factories/user/make-create-player-use-case";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export class CreatePlayerController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const payload = userSchema.parse(req.body);
      const sut = makeCreatePlayerUseCase();
      const response = await sut.execute(payload);
      return res.status(201).send(
        PlayerPresenter.toHttp(response.player)
      );
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Create player controler error", err);
      return res.status(422).send(err);
    }
  }
}