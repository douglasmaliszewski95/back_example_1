import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { PLAYER_STATUS } from "../../../../core/enums/player-status-enum";
import { makeGetPlayersReportUseCase } from "../factories/user/make-get-players-report-use-case";
import { ReportFileContentType } from "../../../../core/enums/report-enum";

const getAllPlayersReportSchema = z.object({
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

export class GetPlayersReportController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const parsedParams = getAllPlayersReportSchema.parse(req.query);
      const sut = makeGetPlayersReportUseCase();
      const response = await sut.execute(parsedParams);
      res.header("Content-Disposition", `attachment; filename=${response.fileName}`);
      res.header("Content-Type", ReportFileContentType[response.fileFormat]);
      return res.send(response.file);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.error("Get all players report error", err);
      return res.status(500).send(err);
    }
  };
}
