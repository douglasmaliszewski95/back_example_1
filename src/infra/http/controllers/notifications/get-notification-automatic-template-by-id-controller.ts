import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeGetNotificationAutomaticTemplateByIdUseCase } from "../factories/notification/make-get-notification-automatic-template-by-id-use-case";

const paramsSchema = z.object({
  id: z.coerce.number()
});

export class GetNotificationAutomaticTemplateByIdController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { id } = paramsSchema.parse(req.params);
      const sut = makeGetNotificationAutomaticTemplateByIdUseCase();
      const response = await sut.execute(id);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Get notification automatic template by ID controller error`, err);
      return res.status(500).send("error while fetching the notification automatic template");
    }
  };
}
