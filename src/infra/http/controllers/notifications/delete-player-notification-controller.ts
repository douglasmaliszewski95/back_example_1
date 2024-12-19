import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeDeletePlayerNotificationUseCase } from "../factories/notification/make-delete-player-notification-use-case";
import { HttpStatus } from "../../../../core/errors/http-status";

const paramsSchema = z.object({
  id: z.coerce.number()
});

export class DeletePlayerNotificationController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "invalid token");
      const accessToken = authHeader.split(" ")[1];
      const { id } = paramsSchema.parse(req.params);
      const sut = makeDeletePlayerNotificationUseCase();
      await sut.execute(accessToken, id);
      return res.status(204).send();
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Delete player Notification controller error`, err);
      return res.status(400).send("error while deleting notification");
    }
  };
}
