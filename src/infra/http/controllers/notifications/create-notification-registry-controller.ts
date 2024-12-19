import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeCreateNotificationRegistryUseCase } from "../factories/notification/make-create-notification-registry-use-case";

const pointsSchema = z.object({
  start: z.number().optional(),
  end: z.number().optional()
});

const includePlayersSchema = z.object({
  providerPlayerId: z.string(),
  origin: z.string().optional()
});

const createNotificationRegistrySchema = z.object({
  tier: z.array(z.number()),
  points: z.array(pointsSchema).optional(),
  includePlayers: z.array(includePlayersSchema).optional()
});

const createNotificationRegistryParamsSchema = z.object({
  id: z.coerce.number()
});

export class CreateNotificationRegistryController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { id } = createNotificationRegistryParamsSchema.parse(req.params);
      const body = createNotificationRegistrySchema.parse(req.body);
      const sut = makeCreateNotificationRegistryUseCase();
      await sut.execute(id, body);
      return res.status(201).send();
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Create Notificaation Registry controller error`, err);
      return res.status(400).send("error while creating notification");
    }
  };
}
