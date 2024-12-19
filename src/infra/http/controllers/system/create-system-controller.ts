import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeCreateSystemUsecase } from "../factories/system/make-create-system-usecase";

const schema = z.object({
  name: z.string(),
  description: z.string()
});

export class CreateSystemController {
  async handle(req: FastifyRequest, res: FastifyReply) {
    try {
      const payload = schema.parse(req.body);
      const sut = makeCreateSystemUsecase();
      await sut.execute(payload);

      return res.status(200).send();
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Create System controller error`, err);
      return res.status(400).send("error while inserting system");
    }
  }
}
