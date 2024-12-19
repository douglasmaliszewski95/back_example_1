import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { makeListPlayerNotificationsUseCase } from "../factories/notification/make-list-player-notifications-use-case";
import { z } from "zod";

const listSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10)
});

export class ListPlayerNotificationsController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "invalid token");
      const accessToken = authHeader.split(" ")[1];
      const query = listSchema.parse(req.query);
      const sut = makeListPlayerNotificationsUseCase();
      const response = await sut.execute(accessToken, query);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`List Player Notification controller error`, err);
      return res.status(500).send("error while listing announcements");
    }
  };
}
