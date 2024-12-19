import { z, ZodError } from "zod";
import { makeCheckUsernameUseCase } from "../factories/user/make-check-username-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { nonEmptyTrimmedUsernameString } from "../parsers/parsers";

const paramsSchema = z.object({
  username: nonEmptyTrimmedUsernameString("username")
})

export class CheckUsernameController {
  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { username } = paramsSchema.parse(req.params);
      const sut = makeCheckUsernameUseCase();
      const response = await sut.execute(username);

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).send(err.errors[0].message);
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Check player username controler error", err);
      return res.status(500).send(err);
    }
  }
}