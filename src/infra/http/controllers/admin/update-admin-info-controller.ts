import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpException } from "../../../../core/errors/HttpException";
import { makeUpdateAdminInfoUseCase } from "../factories/admin/make-update-admin-info-use-case";
import { AdminStatus } from "../../../../core/enums/admin-status-enum";

const updateBodySchema = z.object({
  fullname: z.string().optional(),
  status: z.enum([AdminStatus.ACTIVE, AdminStatus.INACTIVE, AdminStatus.PENDING]).optional(),
});

const updateParamsSchema = z.object({
  id: z.string(),
});

export class UpdateAdminInfoController {

  handle = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const payload = updateBodySchema.parse(req.body);
      const { id } = updateParamsSchema.parse(req.params)
      const sut = makeUpdateAdminInfoUseCase();
      const response = await sut.execute(id, payload);
      return res.status(200).send(response);
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`Update admin controller error`, err);
      return res.status(400).send("error while fetching user");
    }
  }
}