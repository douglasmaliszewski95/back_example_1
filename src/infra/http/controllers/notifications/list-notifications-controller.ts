import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeListNotificationsUseCase } from "../factories/notification/make-list-notifications-use-case";
import { z } from "zod";

const listSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  title: z.string().optional(),
  tier: z.string().optional(),
  status: z.array(
    z.preprocess(
      value => (typeof value === "string" ? value.toUpperCase() : value),
      z.enum(["DRAFT", "INACTIVE", "PENDING", "ACTIVE"])
    )
  ).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
});

export class ListNotificationsController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const query = listSchema.parse(req.query);
      const sut = makeListNotificationsUseCase();
      const response = await sut.execute(query);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`List Notification controller error`, err);
      return res.status(400).send("error while listing notifications");
    }
  };
}
