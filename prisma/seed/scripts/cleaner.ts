import { PrismaClient } from "@prisma/client";
import { env } from "../../../src/infra/env";

export function useCleaner() {
  const prisma = new PrismaClient();

  async function cleanPlayers(whitelist: string[] = []) {
    if (env.NODE_ENV === "production") return;

    const whitelistTarget = [
      "@gmail.com",
      "@yahoo.com",
      "@hotmail.com",
      "@outlook.com",
      "@lighthouseit.com.br",
      ...whitelist
    ];

    const players = await prisma.player.findMany();

    const playersToDelete = players.filter(
      player => !whitelistTarget.some(email => player.supabaseEmail?.includes(email))
    );

    const promises = playersToDelete.map(async player => {
      await prisma.$transaction([
        prisma.playerSeasonPoints.deleteMany({
          where: {
            providerPlayerId: player.providerPlayerId
          }
        }),
        prisma.playerTotalPoints.deleteMany({
          where: {
            providerPlayerId: player.providerPlayerId
          }
        }),
        prisma.notificationRegistry.deleteMany({
          where: {
            recipientId: player.providerPlayerId
          }
        }),
        prisma.task.deleteMany({
          where: {
            providerPlayerId: player.providerPlayerId
          }
        }),
        prisma.player.delete({
          where: {
            id: player.id
          }
        })
      ]);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    cleanPlayers
  };
}
