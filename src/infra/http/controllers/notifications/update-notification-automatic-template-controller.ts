import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeUpdateNotificationAutomaticTemplateUseCase } from "../factories/notification/make-update-notification-automatic-template-use-case";
import { HttpStatus } from "../../../../core/errors/http-status";

const paramsSchema = z.object({
  id: z.coerce.number()
});

const bodySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  active: z.boolean().optional()
});

export class UpdateNotificationAutomaticTemplateController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "invalid token");
      const accessToken = authHeader.split(" ")[1];
      const query = paramsSchema.parse(req.params);
      const body = bodySchema.parse(req.body);
      const sut = makeUpdateNotificationAutomaticTemplateUseCase();
      const response = await sut.execute(accessToken, query.id, body);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Update notification automatic template controller error`, err);
      return res.status(500).send("error while updating notification automatic template");
    }
  };
}
