import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeFindAdminByIdUseCase } from "../factories/admin/make-find-admin-by-id-use-case";

const findAdminSchema = z.object({
  id: z.string(),
});

export class FindAdminByIdController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { id } = findAdminSchema.parse(req.params);
      const sut = makeFindAdminByIdUseCase();
      const response = await sut.execute(id);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      return res.status(400).send("error while fetching user");
    }
  }
}