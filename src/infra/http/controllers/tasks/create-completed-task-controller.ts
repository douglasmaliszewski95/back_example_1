import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeCreateCompletedTaskUseCase } from "../factories/task/make-create-completed-task-use-case";

const createCompletedTaskBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  points: z.number(),
  completedDate: z.coerce.date(),
  providerPlayerId: z.string().optional(),
  telegramId: z.string().optional(),
  taskId: z.string().optional(),
});

const createCompletedTaskQuerySchema = z.object({
  system: z.string(),
});

export class CreateCompletedTaskController {

  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {

    try {
      const { system } = createCompletedTaskQuerySchema.parse(req.query);
      const payload = createCompletedTaskBodySchema.parse(req.body);
      const sut = makeCreateCompletedTaskUseCase();
      const response = await sut.execute(system, payload);
      return res.status(201).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Create Completed controller error`, err);
      return res.status(400).send("error while inserting task");
    }
  }
}