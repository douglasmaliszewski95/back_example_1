import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpStatus } from "../../../../core/errors/http-status";
import { makeRequestOTPPlayerUseCase } from "../factories/user/make-request-otp-player-use-case";

const otpRequest = z.object({
  email: z.string()
})

export class RequestOTPPlayerController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const body = otpRequest.parse(req.query);
      const sut = makeRequestOTPPlayerUseCase();
      const response = await sut.execute(body.email);
      return res.status(HttpStatus.OK).send(response);
    } catch (err) {
      return res.status(HttpStatus.OK).send({success: false, message: err})
    }
  }
}