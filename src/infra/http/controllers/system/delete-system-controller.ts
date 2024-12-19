import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeDeleteSystemUsecase } from "../factories/system/make-delete-system-usecase";

const schema = z.object({
  id: z.coerce.number()
});

export class DeleteSystemController {
  async handle(req: FastifyRequest, res: FastifyReply) {
    try {
      const param = schema.parse(req.params);
      const sut = makeDeleteSystemUsecase();
      await sut.execute(param.id);

      return res.status(200).send();
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Delete System controller error`, err);
      return res.status(400).send("error while deleting system");
    }
  }
}
