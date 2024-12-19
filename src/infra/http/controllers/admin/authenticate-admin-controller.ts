import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeAuthenticateAdminUseCase } from "../factories/admin/make-authenticate-admin-use-case";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export class AuthenticateAdminController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const payload = authSchema.parse(req.body);
      const sut = makeAuthenticateAdminUseCase();
      const response = await sut.execute(payload);

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      return res.status(500).send(err);
    }
  }
}