import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeGetAdminInfoUseCase } from "../factories/admin/make-get-admin-info-use-case";

export class GetAdminInfoController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {

    try {
      const token = req.headers.authorization;
      const sut = makeGetAdminInfoUseCase();
      const response = await sut.execute({ token });

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      return res.status(400).send(err);
    }
  }
}