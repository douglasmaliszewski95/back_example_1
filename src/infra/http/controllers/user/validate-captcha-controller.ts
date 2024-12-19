import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeValidateCaptchaUseCase } from "../factories/user/make-validate-captcha-use-case";

const captchaSchema = z.object({
  tokenCaptcha: z.string()
});

export class ValidateCaptchaController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    const { tokenCaptcha } = captchaSchema.parse(req.body);
    try {
      const sut = makeValidateCaptchaUseCase();
      const response = await sut.execute(tokenCaptcha);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Validate captcha controler error", err);
      return res.status(400).send(err);
    }
  };
}
