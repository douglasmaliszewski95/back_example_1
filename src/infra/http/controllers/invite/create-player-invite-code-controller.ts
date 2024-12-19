import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeCreatePlayerInviteCodeUseCase } from "../factories/invite/make-create-player-invite-code-use-case";

const bodySchema = z.object({
  providerPlayerId: z.string(),
  expiresIn: z.coerce.date(),
  inviteCode: z.string()
})

export class CreatePlayerInviteCodeController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const body = bodySchema.parse(req.body);
      const sut = makeCreatePlayerInviteCodeUseCase();
      await sut.execute(body);
      return res.status(201).send("Invite code created successfully");
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Create Player Invite Code controller error`, err);
      return res.status(400).send("error while creating invite code");
    }
  }
}