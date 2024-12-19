import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeUpdatePlayerPasswordUseCase } from "../factories/user/make-update-player-password-use-case";

const updatePasswordSchema = z.object({
  newPassword: z.string(),
  refreshToken: z.string()
})

export class UpdatePlayerPasswordController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const body = updatePasswordSchema.parse(req.body);
      const token = req.headers.authorization;
      const sut = makeUpdatePlayerPasswordUseCase();
      const response = await sut.execute({
        newPassword: body.newPassword,
        accessToken: token,
        refreshToken: body.refreshToken
      });

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Update player password controler error", err);
      return res.status(400).send(err);
    }
  }
}