import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { PrismaApplicationLogRepository } from "../../../database/prisma-repositories/prisma-application-log-repository";
import { makeCheckCampaignsUseCase } from "../factories/campaign/make-check-campaigns-use-case";
import { LogLevel, LogOrigin } from "../../../../core/enums/log-enum";

export class CheckCampaignsController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    const applicationRepo = new PrismaApplicationLogRepository();
    try {
      await applicationRepo.create({
        content: 'check campaigns cron triggered',
        level: LogLevel.INFO,
        origin: LogOrigin.CHECK_CAMPAIGNS_CRON
      });

      const sut = makeCheckCampaignsUseCase();
      await sut.execute();
      await applicationRepo.create({
        content: 'check campaigns cron finsished',
        level: LogLevel.INFO,
        origin: LogOrigin.CHECK_CAMPAIGNS_CRON
      });

      return res.status(200).send("cron triggered");
    } catch (err) {
      if (err instanceof HttpException) {
        await applicationRepo.create({
          content: `${err.status}: ${err.message}`,
          level: LogLevel.ERROR,
          origin: LogOrigin.CHECK_CAMPAIGNS_CRON
        });
        return res.status(err.status).send(err.message);
      };
      await applicationRepo.create({
        content: JSON.stringify(err),
        level: LogLevel.ERROR,
        origin: LogOrigin.CHECK_CAMPAIGNS_CRON
      });
      return res.status(400).send("error triggering cron");
    }
  }
}