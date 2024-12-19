import { AcceptPlayerInviteUseCase } from "../../../../../domain/user/application/use-cases/user/accept-player-invite-use-case";
import { PrismaInvitedPlayersRepository } from "../../../../database/prisma-repositories/prisma-invited-players-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeAcceptPlayerInviteUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const invitedPlayersRepository = new PrismaInvitedPlayersRepository();
  const sut = new AcceptPlayerInviteUseCase(playersRepository, invitedPlayersRepository);
  return sut;
}