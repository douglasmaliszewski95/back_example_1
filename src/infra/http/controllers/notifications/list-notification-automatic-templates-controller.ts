import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeListNotificationAutomaticTemplatesUseCase } from "../factories/notification/make-list-notification-automatic-templates-use-case";
import { z } from "zod";

const listSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10)
});

export class ListNotificationAutomaticTemplatesController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const query = listSchema.parse(req.query);
      const sut = makeListNotificationAutomaticTemplatesUseCase();
      const response = await sut.execute(query);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`List notification automatic templates controller error`, err);
      return res.status(500).send("error while listing notifications automatic templates");
    }
  };
}
