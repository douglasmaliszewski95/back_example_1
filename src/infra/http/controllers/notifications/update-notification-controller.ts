import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeUpdateNotificationController } from "../factories/notification/make-update-notification-use-case";

const updateNotificationSchema = z.object({
  isDraft: z.boolean(),
  title: z.string().optional(),
  content: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
});

const updateNotificationParamSchema = z.object({
  id: z.coerce.number()
});

export class UpdateNotificationController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const body = updateNotificationSchema.parse(req.body);
      const { id } = updateNotificationParamSchema.parse(req.params);
      const sut = makeUpdateNotificationController();
      const response = await sut.execute(id, body);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Update Notification controller error`, err);
      return res.status(400).send("error while creating notification registry");
    }
  };
}
