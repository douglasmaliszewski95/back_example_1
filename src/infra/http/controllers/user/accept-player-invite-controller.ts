import { z } from "zod";
import { makeAcceptPlayerInviteUseCase } from "../factories/user/make-accept-player-invite-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";

const bodySchema = z.object({
  inviteCode: z.string().transform(val => decodeURIComponent(val)),
  invitedProviderPlayerId: z.string()
});

export class AcceptPlayerInviteController {
  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      console.log(new Date());
      const { inviteCode, invitedProviderPlayerId } = bodySchema.parse(req.body);
      const sut = makeAcceptPlayerInviteUseCase();
      const response = await sut.execute(inviteCode, invitedProviderPlayerId);

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Accept player invite controler error", err);
      return res.status(500).send(err);
    }
  }
}