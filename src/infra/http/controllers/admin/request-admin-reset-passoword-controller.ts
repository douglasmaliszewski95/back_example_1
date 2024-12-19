import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeRequestAdminResetPasswordUseCase } from "../factories/admin/make-request-admin-reset-password-use-case";

const resetRequest = z.object({
  email: z.string().email()
})

export class RequestAdminResetPasswordController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const body = resetRequest.parse(req.body);
      const sut = makeRequestAdminResetPasswordUseCase();
      const response = await sut.execute(body);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Admin reset password request error`, err);
      return res.status(400).send(err);
    }
  }
}