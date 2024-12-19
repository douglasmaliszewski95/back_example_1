import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeWalletAnonymousUserUseCase } from "../factories/user/make-wallet-anonymous-user-use-case";
import { HttpStatus } from "../../../../core/errors/http-status";

const walletSchema = z.object({
  wallet: z.string()
});

export class WalletAnonymousUserController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    const { wallet } = walletSchema.parse(req.body);
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
      const currentToken = accessToken.split(" ");
      const token = currentToken[1];
      const sut = makeWalletAnonymousUserUseCase();
      const response = await sut.execute(wallet, token);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Wallet anonymous user controler error", err);
      return res.status(400).send(err);
    }
  };
}
