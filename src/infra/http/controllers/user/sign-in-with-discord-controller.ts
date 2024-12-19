import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeSignInWithDiscordUseCase } from "../factories/user/make-sign-in-with-discord-use-case";
import { z } from "zod";

const discordBodySchema = z.object({
  inviteCode: z.string().transform(val => decodeURIComponent(val)).optional(),
});

export class SigninWithDiscordController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {

    try {
      const { inviteCode } = discordBodySchema.parse(req.query);
      const sut = makeSignInWithDiscordUseCase();
      const response = await sut.execute(inviteCode);

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Discord login controler error", err);
      return res.status(400).send(err);
    }
  }
}