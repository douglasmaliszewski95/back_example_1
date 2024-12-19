import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeAcceptTermsPlayerUseCase } from "../factories/user/make-accept-terms-player-use-case";
import { HttpStatus } from "../../../../core/errors/http-status";

const termsRequest = z.object({
  accepted: z.boolean(),
  inviteCode: z.string().optional(),
  tokenGalxe: z.string(),
  refreshToken: z.string()
});

export class AcceptTermsPlayerController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
      const currentToken = accessToken.split(" ");
      const token = currentToken[1];
      const body = termsRequest.parse(req.body);
      const sutTerms = makeAcceptTermsPlayerUseCase();
      const responseTerms = await sutTerms.execute(body, token);
      return res.status(200).send(responseTerms);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("accept terms player controler error", err);
      return res.status(401).send(err);
    }
  };
}
