import { ListPlayerInviteCodesUseCase } from "../../../../../domain/user/application/use-cases/invite/list-player-invite-codes-use-case";
import { PrismaPlayerInviteCodesRepository } from "../../../../database/prisma-repositories/prisma-player-invite-codes-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeListPlayerInviteCodeUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const playerInviteCodesRepository = new PrismaPlayerInviteCodesRepository()
  const sut = new ListPlayerInviteCodesUseCase(playersRepository, playerInviteCodesRepository);
  return sut;
}