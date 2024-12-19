import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import fs from "fs";
import path from "path";
import readline from "readline"

export class ListLogsController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    try {
      const dirPath = path.resolve(__dirname, "../../../../../logs");
      const logFiles = fs.readdirSync(dirPath);
      const logs = []

      for (const logFile of logFiles) {
        const filePath = path.resolve(dirPath, logFile);
        const fileStream = fs.createReadStream(filePath)
        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity
        });

        for await (const line of rl) {
          logs.push(line)
        }
      }

      return res.status(200).send(logs.reverse());
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      return res.status(500).send("error while listing logs");
    }
  }
}