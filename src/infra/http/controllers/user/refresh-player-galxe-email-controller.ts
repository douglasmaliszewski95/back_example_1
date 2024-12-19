import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
// import { z } from "zod";
import { makeRefreshPlayerGalxeEmailUseCase } from "../factories/user/make-refresh-player-galxe-email-use-case";

// const refreshEmailRequest = z.object({
//   tokenGalxe: z.string(),
//   refreshToken: z.string()
// })

export class RefreshPlayerGalxeEmailController {
  handle = async (req: FastifyRequest, res: FastifyReply) => {

    try {
      // const parsedParams = refreshEmailRequest.parse(req.query);
      const accessToken = req.headers.authorization;
      if (!accessToken) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
      const currentToken = accessToken.split(" ");
      const token = currentToken[1];
      const sut = makeRefreshPlayerGalxeEmailUseCase();
      const response = await sut.execute(token);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("RefreshPlayerGalxeEmailController", err);
      return res.status(400).send(err);
    }
  }
}