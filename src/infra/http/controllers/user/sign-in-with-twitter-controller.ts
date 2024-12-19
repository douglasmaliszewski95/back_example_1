import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeSignInWithTwitterUseCase } from "../factories/user/make-sign-in-with-twitter-use-case";
import { z } from "zod";

const twitterBodySchema = z.object({
  inviteCode: z.string().transform(val => decodeURIComponent(val)).optional(),
});

export class SigninWithTwitterController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {

    try {
      const { inviteCode } = twitterBodySchema.parse(req.query);
      const sut = makeSignInWithTwitterUseCase();
      const response = await sut.execute(inviteCode);

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Twitter login controler error", err);
      return res.status(400).send(err);
    }
  }
}