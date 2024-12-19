import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeDeleteNotificationUseCase } from "../factories/notification/make-delete-notification-use-case";

const paramsSchema = z.object({
  id: z.coerce.number()
});

export class DeleteNotificationController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { id } = paramsSchema.parse(req.params);
      const sut = makeDeleteNotificationUseCase();
      await sut.execute(id);
      return res.status(200).send();
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Delete Notificaation controller error`, err);
      return res.status(400).send("error while deleting notification");
    }
  }
}