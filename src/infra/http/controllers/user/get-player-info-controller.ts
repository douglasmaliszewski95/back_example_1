import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeGetPlayerInfoUseCase } from "../factories/user/make-get-player-info-use-case";

export class GetPlayerInfoController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {

    try {
      const token = req.headers.authorization;
      const sut = makeGetPlayerInfoUseCase();
      const response = await sut.execute({ token });
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Get player controler error", err);
      return res.status(400).send(err);
    }
  }
}