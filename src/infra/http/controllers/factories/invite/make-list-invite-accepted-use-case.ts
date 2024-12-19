import { ListInviteAcceptedUseCase } from "../../../../../domain/user/application/use-cases/invite/list-invite-accepted-use-case";
import { PrismaInvitedPlayersRepository } from "../../../../database/prisma-repositories/prisma-invited-players-repository";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";

export function makeListInviteAcceptedUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const invitedPlayersRepository = new PrismaInvitedPlayersRepository();
  const sut = new ListInviteAcceptedUseCase(playersRepository, invitedPlayersRepository);
  return sut;
}
