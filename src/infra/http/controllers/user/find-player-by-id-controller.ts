import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeFindPlayerByIdUseCase } from "../factories/user/make-find-user-by-id-use-case";

const findPlayerSchema = z.object({
  id: z.string(),
  system: z.string()
});

export class FindPlayerByIdController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { id, system } = findPlayerSchema.parse(req.query);
      const sut = makeFindPlayerByIdUseCase();
      const response = await sut.execute(id, system);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Find player controler error", err);
      return res.status(400).send("error while fetching user");
    }
  }
}