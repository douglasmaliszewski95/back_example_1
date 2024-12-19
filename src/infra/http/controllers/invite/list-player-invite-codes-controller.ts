import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { z } from "zod";
import { makeListPlayerInviteCodeUseCase } from "../factories/invite/make-list-player-invite-code-use-case";

const listSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
});

const paramsScheam = z.object({
  id: z.string()
});

export class ListPlayerInviteCodesController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const query = listSchema.parse(req.query);
      const { id } = paramsScheam.parse(req.params);
      const sut = makeListPlayerInviteCodeUseCase();
      const response = await sut.execute(id, query);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`List Player Invite Codes controller error`, err);
      return res.status(400).send("error while listing invite codes");
    }
  }
}