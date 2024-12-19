import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeSigninWithGalxeUseCase } from "../factories/campaign/make-signin-with-galxe-use-case";

export class SinginWithGalxeController {
  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const sut = makeSigninWithGalxeUseCase();
      const response = await sut.execute();
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Signin with galxe controller error`, err);
      return res.status(400).send("error while retrieving galxe signin");
    }
  }
}