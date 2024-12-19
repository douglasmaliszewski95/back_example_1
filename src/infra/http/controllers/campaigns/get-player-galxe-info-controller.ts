import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeGetPlayerGalxeInfoUseCase } from "../factories/campaign/make-get-player-galxe-info-use-case";
import { z } from "zod";
import { HttpStatus } from "../../../../core/errors/http-status";

const getPlayerGalxeInfoSchema = z.object({
  code: z.string()
});

export class GetPlayerGalxeInfoController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { code } = getPlayerGalxeInfoSchema.parse(req.body);
      const accessToken = req.headers.authorization;
      if (!accessToken) throw new HttpException(HttpStatus.UNAUTHORIZED, "unauthorized");
      const currentToken = accessToken.split(" ");
      const token = currentToken[1];
      const sut = makeGetPlayerGalxeInfoUseCase();
      const response = await sut.execute(token, code);
      return res.status(200).send(response.player);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Get Player Galxe info controller error`, err);
      return res.status(400).send("error while retrieving galxe information");
    }
  }
}