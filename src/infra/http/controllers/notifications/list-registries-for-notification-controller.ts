import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeListRegistriesForNotificationUseCase } from "../factories/notification/make-list-registries-for-notification-use-case";


const listSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10)
});

const paramsSchema = z.object({
  id: z.coerce.number()
});

export class ListRegistriesForNotificationController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const query = listSchema.parse(req.query);
      const { id } = paramsSchema.parse(req.params);
      const sut = makeListRegistriesForNotificationUseCase();
      const response = await sut.execute(id, query);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`List Notification Registries controller error`, err);
      return res.status(400).send("error while listing registries");
    }
  }
}