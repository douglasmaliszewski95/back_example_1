import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeValidateOTPPlayerUseCase } from "../factories/user/make-validate-otp-player-use-case";

const otpValidate = z.object({
  tokenOTP: z.string(),
  email: z.string()
})

export class ValidateOTPPlayerController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const body = otpValidate.parse(req.body);
      const sut = makeValidateOTPPlayerUseCase();
      const response = await sut.execute(body.email, body.tokenOTP);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("validate otp player controler error", err);
      return res.status(400).send(err);
    }
  }
}