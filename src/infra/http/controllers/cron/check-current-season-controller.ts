import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeCheckCurrentSeasonUseCase } from "../factories/season/make-check-current-season-use-case";
import { PrismaApplicationLogRepository } from "../../../database/prisma-repositories/prisma-application-log-repository";
import { LogLevel, LogOrigin } from "../../../../core/enums/log-enum";

export class CheckCurrentSeasonController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    const applicationRepo = new PrismaApplicationLogRepository();
    try {
      await applicationRepo.create({
        content: 'season cron triggered',
        level: LogLevel.INFO,
        origin: LogOrigin.CHECK_CURRENT_SEASON_CRON
      });

      const sut = makeCheckCurrentSeasonUseCase()
      await sut.execute();
      await applicationRepo.create({
        content: 'season cron finsished',
        level: LogLevel.INFO,
        origin: LogOrigin.CHECK_CURRENT_SEASON_CRON
      });

      return res.status(200).send("cron triggered");
    } catch (err) {
      if (err instanceof HttpException) {
        await applicationRepo.create({
          content: `${err.status}: ${err.message}`,
          level: LogLevel.ERROR,
          origin: LogOrigin.CHECK_CURRENT_SEASON_CRON
        });
        return res.status(err.status).send(err.message);
      };
      await applicationRepo.create({
        content: JSON.stringify(err),
        level: LogLevel.ERROR,
        origin: LogOrigin.CHECK_CURRENT_SEASON_CRON
      });
      return res.status(400).send("error triggering cron");
    }
  }
}