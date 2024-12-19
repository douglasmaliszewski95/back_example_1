import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetsystemById } from "../factories/system/make-get-system-by-id-usecase";
import { HttpException } from "../../../../core/errors/HttpException";

const schema = z.object({
  id: z.coerce.number()
});

export class GetSystemByIdController {
  async handle(req: FastifyRequest, res: FastifyReply) {
    try {
      const param = schema.parse(req.params);
      const sut = makeGetsystemById();
      const response = await sut.execute(param.id);

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Get System controller error`, err);
      return res.status(400).send("error while fetching system");
    }
  }
}
