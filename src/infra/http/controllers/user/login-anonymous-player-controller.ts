import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
// import { makeLoginAnonymousPlayerUseCase } from "../factories/user/make-login-anonymous-player-use-case";

const loginAnonymousPlayerSchema = z.object({
  tokenCaptcha: z.string()
});

export class LoginAnonymousPlayerController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    const { tokenCaptcha } = loginAnonymousPlayerSchema.parse(req.query);
    try {
      // const sut = makeLoginAnonymousPlayerUseCase();
      // const response = await sut.execute(tokenCaptcha);
      return res.status(200).send("OK");
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Login anonymous player controler error", err);
      return res.status(400).send(err);
    }
  };
}
