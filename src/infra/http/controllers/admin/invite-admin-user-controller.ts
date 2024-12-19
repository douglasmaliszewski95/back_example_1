import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeInviteAdminUserUseCase } from "../factories/admin/make-invite-admin-use-case";

const inviteSchema = z.object({
  email: z.string().email(),
  fullname: z.string()
})

export class InviteAdminUserController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { email, fullname } = inviteSchema.parse(req.body);
      const sut = makeInviteAdminUserUseCase();
      const response = await sut.execute(email, fullname);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      return res.status(400).send(err);
    }
  }
}