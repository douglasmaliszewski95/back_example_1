import { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeRefreshPlayerGalxeTelegramIdUseCase } from "../factories/user/make-refresh-player-galxe-telegram-id-use-case";

export class RefreshPlayerGalxeTelegramIdController {
  handle = async (req: FastifyRequest, res: FastifyReply) => {

    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
      const currentToken = accessToken.split(" ");
      const token = currentToken[1];
      const sut = makeRefreshPlayerGalxeTelegramIdUseCase();
      const response = await sut.execute(token);
      return res.status(HttpStatus.OK).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("RefreshPlayerGalxeTelegramIdController", err);
      return res.status(HttpStatus.BAD_REQUEST).send(err);
    }
  }
}