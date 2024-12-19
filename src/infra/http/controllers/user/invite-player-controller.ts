import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeInvitePlayerUseCase } from "../factories/user/make-invite-player-use-case";

const inviteSchema = z.object({
  email: z.string().email(),
  inviteCode: z.string().transform(val => decodeURIComponent(val)).optional()
});

export class InvitePlayerController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const { email, inviteCode } = inviteSchema.parse(req.body);
      const sut = makeInvitePlayerUseCase();
      await sut.execute(email, inviteCode);
      return res.status(201).send();
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("Invite player controler error", err);
      return res.status(400).send(err);
    }
  };
}
