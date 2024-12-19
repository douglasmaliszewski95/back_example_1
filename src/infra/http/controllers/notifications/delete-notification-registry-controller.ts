import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeDeleteNotificationRegistryUseCase } from "../factories/notification/make-delete-notification-registry-use-case";

const paramsSchema = z.object({
  id: z.coerce.number()
});

const querySchema = z
  .object({
    playerProviderId: z.string().optional()
  })
  .optional();

export class DeleteNotificationRegistryController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { id } = paramsSchema.parse(req.params);
      const query = querySchema.parse(req.query);
      const sut = makeDeleteNotificationRegistryUseCase();
      await sut.execute(id, query?.playerProviderId);
      return res.status(204).send();
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Delete Notificaation Registry controller error`, err);
      return res.status(400).send("error while deleting notification");
    }
  };
}
