import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeListPlayerAnnouncementsUseCase } from "../factories/announcements/make-list-player-announcements-use-case";
import { HttpStatus } from "../../../../core/errors/http-status";

export class ListPlayerAnnouncementsController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "invalid token");
      const token = authHeader.split(" ")[1];
      const sut = makeListPlayerAnnouncementsUseCase();
      const response = await sut.execute(token);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`List Player Announcements controller error`, err);
      return res.status(500).send("error while listing announcements");
    }
  };
}
