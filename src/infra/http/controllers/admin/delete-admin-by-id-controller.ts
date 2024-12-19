import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeDeleteAdminByIdUseCase } from "../factories/admin/make-delete-admin-by-id-use-case";

const deleteParamsSchema = z.object({
  id: z.string(),
});

export class DeleteAdminByIdController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { id } = deleteParamsSchema.parse(req.params)
      const sut = makeDeleteAdminByIdUseCase();
      const response = await sut.execute(id);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      return res.status(400).send("error while fetching user");
    }
  }
}