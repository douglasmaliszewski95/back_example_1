import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { PLAYER_STATUS } from "../../../../core/enums/player-status-enum";
import { makeListAllPlayersUseCase } from "../factories/user/make-list-all-players-use-case";

const listAllPlayersSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  id: z.coerce.number().optional(),
  tier: z.coerce.number().array().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  wallet: z.string().optional(),
  seasonPointsStart: z.coerce.number().optional(),
  seasonPointsEnd: z.coerce.number().optional(),
  totalPointsStart: z.coerce.number().optional(),
  totalPointsEnd: z.coerce.number().optional(),
  startCreatedAt: z.coerce.date().optional(),
  endCreatedAt: z.coerce.date().optional(),
  status: z
    .enum([
      PLAYER_STATUS.ACTIVE,
      PLAYER_STATUS.PENDING_ACCOUNT,
      PLAYER_STATUS.PENDING_GALXE,
      PLAYER_STATUS.PENDING_PASSWORD
    ])
    .array()
    .optional()
});

export class ListAllPlayersController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const parsedParams = listAllPlayersSchema.parse(req.query);
      const sut = makeListAllPlayersUseCase();
      const response = await sut.execute(parsedParams);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("List all players controler error", err);
      return res.status(400).send(err);
    }
  };
}
