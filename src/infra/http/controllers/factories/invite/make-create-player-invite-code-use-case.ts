import { CreatePlayerInviteCodeUseCase } from "../../../../../domain/user/application/use-cases/invite/create-player-invite-code-use-case";
import { PrismaPlayerInviteCodesRepository } from "../../../../database/prisma-repositories/prisma-player-invite-codes-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeCreatePlayerInviteCodeUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const playerInviteCodesRepository = new PrismaPlayerInviteCodesRepository()
  const sut = new CreatePlayerInviteCodeUseCase(playersRepository, playerInviteCodesRepository);
  return sut;
}