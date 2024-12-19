import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeCreateNotificationUseCase } from "../factories/notification/make-create-notification-use-case";

const createNotificationSchema = z.object({
  title: z.string(),
  content: z.string(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
});

export class CreateNotificationController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const body = createNotificationSchema.parse(req.body);
      const sut = makeCreateNotificationUseCase();
      const response = await sut.execute(body);
      return res.status(201).send(response.notification);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Create Notificaation controller error`, err);
      return res.status(400).send("error while creating notification");
    }
  };
}
