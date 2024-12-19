import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeListAdminsUseCase } from "../factories/admin/make-list-admins-use-case";

const listAdminsSchema = z.object({
  page: z.number().default(1),
  fullname: z.string().optional(),
  email: z.string().optional(),
  status: z.string().optional(),
  limit: z.number().default(10)
})

export class ListAdminsController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {

    try {
      const { page, email, fullname, status, limit } = listAdminsSchema.parse(req.query);
      const sut = makeListAdminsUseCase();
      const response = await sut.execute({
        page,
        email,
        fullname,
        status,
        limit
      });
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`List admins controller error`, err);
      return res.status(400).send(err);
    }
  }
}