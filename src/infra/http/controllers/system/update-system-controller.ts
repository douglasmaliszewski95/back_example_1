import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateSystemUsecase } from "../factories/system/make-update-system-usecase";
import { SYSTEM_STATUS } from "../../../../domain/system/enterprise/entities/system";
import { HttpException } from "../../../../core/errors/HttpException";

const schema = z.object({
  name: z.string(),
  description: z.string(),
  id: z.number(),
  status: z
    .string()
    .optional()
    .refine(value => {
      return ["ACTIVE", "INACTIVE", "PENDING", undefined].includes(value); // ADD PENDING TO FIX BUG, BUT FRONTEND IS SENDING PENDING WHILE IT WAS NOT A VALID OPTION
    })
});

export class UpdateSystemController {
  async handle(req: FastifyRequest, res: FastifyReply) {
    try {
      const payload = schema.parse(req.body);
      const sut = makeUpdateSystemUsecase();
      await sut.execute({
        ...payload,
        status: payload.status as SYSTEM_STATUS
      });
      return res.status(200).send();
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Update System controller error`, err);
      return res.status(400).send("error while updating systems");
    }
  }
}
