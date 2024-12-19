import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeGetNotificationByIdUseCase } from "../factories/notification/make-get-notification-by-id-use-case";

const paramsSchema = z.object({
  id: z.coerce.number()
});

export class GetNotificationByIdController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { id } = paramsSchema.parse(req.params);
      const sut = makeGetNotificationByIdUseCase();
      const response = await sut.execute(id);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Get Notification by ID controller error`, err);
      return res.status(400).send("error while fetching the notification");
    }
  }
}