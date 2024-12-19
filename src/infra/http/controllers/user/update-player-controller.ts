import { FastifyReply, FastifyRequest } from "fastify";
import { z, ZodError } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { makeUpdatePlayerUseCase } from "../factories/user/make-update-player-use-case";
import { nonEmptyTrimmedUsernameString } from "../parsers/parsers";

const updatePlayerBodySchema = z.object({
  wallet: z.string().optional(),
  username: nonEmptyTrimmedUsernameString("username").optional(),
  inviteCode: z.string().optional()
});

export class UpdatePlayerController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {

    try {
      const body = updatePlayerBodySchema.parse(req.body);
      const token = req.headers.authorization;
      if (!token) throw new HttpException(HttpStatus.UNAUTHORIZED, "unauthorized");
      const sut = makeUpdatePlayerUseCase();
      const response = await sut.execute(token, body);
      return res.status(200).send(response.player);
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).send(err.errors);
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Update player controler error", err);
      return res.status(400).send(err);
    }
  }
}