import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { makeGetPlayerUnreadNotificationsUseCase } from "../factories/notification/make-get-player-unread-notifications-use-case";

export class GetPlayerUnreadNotificationsController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "invalid token");
      const accessToken = authHeader.split(" ")[1];
      const sut = makeGetPlayerUnreadNotificationsUseCase();
      const response = await sut.execute(accessToken);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Get Player Unread Notification controller error`, err);
      return res.status(500).send("error while listing announcements");
    }
  };
}
