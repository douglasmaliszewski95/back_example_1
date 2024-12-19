import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { PrismaApplicationLogRepository } from "../../../database/prisma-repositories/prisma-application-log-repository";
import { LogLevel, LogOrigin } from "../../../../core/enums/log-enum";
import { makeCheckEmailGalxeUseCase } from "../factories/user/make-check-email-galxe-use-case";

export class CheckEmailGalxeController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    const applicationRepo = new PrismaApplicationLogRepository();
    try {
      console.log('check email galxe cron triggered');
      await applicationRepo.create({
        content: 'check email galxe cron triggered!',
        level: LogLevel.INFO,
        origin: LogOrigin.CHECK_EMAIL_GALXE
      });

      const sut = makeCheckEmailGalxeUseCase();
      await sut.execute();
      await applicationRepo.create({
        content: 'check email galxe cron finsished!',
        level: LogLevel.INFO,
        origin: LogOrigin.CHECK_EMAIL_GALXE
      });
      console.log('check email galxe cron finsished');

      return res.status(200).send("cron triggered");
    } catch (err) {
      if (err instanceof HttpException) {
        await applicationRepo.create({
          content: `${err.status}: ${err.message}`,
          level: LogLevel.ERROR,
          origin: LogOrigin.CHECK_EMAIL_GALXE
        });
        return res.status(err.status).send(err.message);
      };
      await applicationRepo.create({
        content: JSON.stringify(err),
        level: LogLevel.ERROR,
        origin: LogOrigin.CHECK_EMAIL_GALXE
      });
      return res.status(400).send("error triggering cron");
    }
  }
}