import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { z } from "zod";
import { makeSaveDepositValueWalletUseCase } from "../factories/staking/make-save-deposit-value-wallet-use-case";

const stakingRequest = z.object({
  value: z.number(),
  wallet: z.string(),
  txHash: z.string()
});

export class SaveDepositValuePlayerController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
      const { value, wallet, txHash } = stakingRequest.parse(req.body);
      const sut = makeSaveDepositValueWalletUseCase();
      const response = await sut.execute(value, wallet, txHash);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("save deposit value player controler error", err);
      return res.status(401).send(err);
    }
  };
}
