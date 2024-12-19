import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeListPlayersUseCase } from "../factories/user/make-list-players-use-case";

const listPlayersSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  username: z.string().optional(),
  discordId: z.string().optional(),
  twitterId: z.string().optional(),
  email: z.string().optional(),
  system: z.string(),
})

export class ListPlayersController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {

    try {
      const { system, ...params } = listPlayersSchema.parse(req.query);
      const sut = makeListPlayersUseCase();
      const response = await sut.execute(system, params);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log("List players controler error", err);
      return res.status(400).send(err);
    }
  }
}