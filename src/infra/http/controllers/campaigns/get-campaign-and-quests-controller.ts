import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeGetCampaignsAndQuestsUseCase } from "../factories/make-get-campaigns-and-quests-use-case";
import { HttpStatus } from "../../../../core/errors/http-status";

const getCampaignsAndQuestsSchema = z.object({
  id: z.string().optional()
});

export class GetCampaignsAndQuestsController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = getCampaignsAndQuestsSchema.parse(req.query);
    try {
      const token = req.headers.authorization;
      if (!token) throw new HttpException(HttpStatus.UNAUTHORIZED, "invalid token")
      const currentToken = token.split(" ");
      const authToken = currentToken[1];
      const sut = makeGetCampaignsAndQuestsUseCase();
      const response = await sut.execute(authToken, id);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Get Campaigns controller error`, err);
      return res.status(400).send("error while retrieving campaigns");
    }
  }
}