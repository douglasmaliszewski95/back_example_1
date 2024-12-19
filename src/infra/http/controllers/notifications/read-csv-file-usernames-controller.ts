import { FastifyRequest, FastifyReply } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../core/errors/http-status";
import { makeReadCsvFileUsernamesUseCase } from "../factories/notification/make-read-csv-file-usernames-use-case";

export class ReadCsvFileUsernamesController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {

    try {
      const data = await req.file();
      if (!data) throw new HttpException(HttpStatus.NOT_FOUND, "File not found");
      const sut = makeReadCsvFileUsernamesUseCase();
      const response = await sut.execute({
        buffer: await data.toBuffer(),
        fileName: data.filename,
        fileType: data.mimetype
      });

      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Read Csv controller error`, err);
      return res.status(400).send("error while reading csv");
    }
  }
}