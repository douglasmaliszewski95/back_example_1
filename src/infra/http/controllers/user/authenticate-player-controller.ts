import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeAuthenticatePlayerUseCase } from "../factories/user/make-authenticate-player-use-case";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export class AuthenticatePlayerController {
  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      console.log(new Date());
      const payload = authSchema.parse(req.body);
      const sut = makeAuthenticatePlayerUseCase();
      const response = await sut.execute(payload);

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Authenticate player controler error", err);
      return res.status(500).send(err);
    }
  }
}