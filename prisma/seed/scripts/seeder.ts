import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { randomInt, randomUUID } from "crypto";
import { env } from "../../../src/infra/env";
import { PLAYER_STATUS } from "../../../src/core/enums/player-status-enum";
import { PrismaPlayersMapper } from "../../../src/infra/database/mappers/prisma-players-mapper";
import { makePlayer } from "../../../tests/factories/make-player";
import { AutomaticNotificationTypeEnum } from "../../../src/core/enums/notification-automatic-enum";

export function useSeeder() {
  const prisma = new PrismaClient();

  async function init() {
    if (env.NODE_ENV === "production") return;

    const [systemExists, galxeTasksSystemExists] = await Promise.all([
      prisma.system.findFirst({
        where: {
          name: "credbull-test"
        }
      }),
      prisma.system.findFirst({
        where: {
          name: "galxe-tasks-test"
        }
      })
    ]);

    if (!systemExists) {
      try {
        await prisma.system.create({
          data: {
            description: "credbull-test system",
            name: "credbull-test",
            systemId: "2ddf2264-0198-4676-91cc-4f3e8c1e8c7a",
            status: "ACTIVE"
          }
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (!galxeTasksSystemExists) {
      try {
        await prisma.system.create({
          data: {
            description: "galxe-tasks system",
            name: "galxe-tasks-test",
            systemId: "494da9b2-9d78-4124-bf04-fc61deb64448",
            status: "ACTIVE"
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function seedStaking(amount = 100) {
    if (env.NODE_ENV === "production") return;

    let valueDeposit = 0;
    const stakingList = Array.from({ length: amount }, () => {
      valueDeposit = parseFloat(valueDeposit.toString()) + 0.25;

      return {
        totalDeposit: valueDeposit,
        currency: "CBL",
        progress: 0,
        wallet: faker.finance.ethereumAddress(),
        txHash: randomUUID()
      };
    });

    try {
      await Promise.all(
        stakingList.map(async staking => {
          const insertStaking = await prisma.staking.create({
            data: {
              totalDeposit: staking.totalDeposit as unknown as number,
              currency: staking.currency,
              progress: staking.progress as unknown as number,
              wallet: staking.wallet
            }
          });

          if (insertStaking) {
            await prisma.stakingHistory.create({
              data: {
                txHash: staking.txHash,
                stakingId: insertStaking.id,
                tokenDeposit: staking.totalDeposit
              }
            });
            const stakingHistory = await prisma.stakingHistory.findMany();
            const positionIndex = stakingHistory.findIndex(x => x.stakingId === insertStaking.id);
            const progress = 100 - (positionIndex / stakingHistory.length) * 100;
            const updateStaking = await prisma.staking.update({
              where: {
                id: insertStaking.id
              },
              data: {
                progress,
                totalDeposit: staking.totalDeposit
              }
            });
            console.log(updateStaking);
          }
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function seedPlayers(amount = 50) {
    if (env.NODE_ENV === "production") return;

    const players = Array.from({ length: amount }, () => {
      const email = faker.internet.exampleEmail().toLowerCase();
      const username = email.split("@")[0];
      return makePlayer({
        email,
        username,
        status: PLAYER_STATUS.ACTIVE,
        origin: "email",
        providerPlayerId: randomUUID(),
        supabaseEmail: faker.internet.email(),
        avatarUrl: `https://api.dicebear.com/9.x/identicon/svg?seed=${username}`,
        tier: randomInt(1, 3)
      });
    });

    try {
      await prisma.player.createMany({
        data: players.map(player => PrismaPlayersMapper.toPrisma(player))
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function seedPlayersSeasonPoints() {
    if (env.NODE_ENV === "production") return;

    const activeSeason = await prisma.season.findFirst({
      where: {
        active: true
      }
    });

    if (!activeSeason) return;

    const players = await prisma.player.findMany();

    const promises = players.map(async player => {
      const seasonPointsExistsForPlayer = await prisma.playerSeasonPoints.findFirst({
        where: {
          providerPlayerId: player.providerPlayerId,
          seasonId: activeSeason.id
        }
      });

      if (!!seasonPointsExistsForPlayer) return;

      return prisma.playerSeasonPoints.create({
        data: {
          points: randomInt(1000),
          seasonId: activeSeason.id,
          providerPlayerId: player.providerPlayerId,
          tier: randomInt(1, 3),
          progress: 0
        }
      });
    });

    try {
      await Promise.all(promises);
    } catch (err) {
      console.error(err);
    }
  }

  async function seedPlayersTotalPoints() {
    if (env.NODE_ENV === "production") return;

    const players = await prisma.player.findMany();

    const promises = players.map(async player => {
      const totalPointsExistsForPlayer = await prisma.playerTotalPoints.findFirst({
        where: {
          providerPlayerId: player.providerPlayerId
        }
      });

      if (totalPointsExistsForPlayer) return;

      const playerSeasonPoints = await prisma.playerSeasonPoints.findFirst({
        where: {
          providerPlayerId: player.providerPlayerId
        },
        orderBy: {
          seasonId: "desc"
        }
      });

      if (!playerSeasonPoints) return;

      return prisma.playerTotalPoints.create({
        data: {
          points: playerSeasonPoints.points + randomInt(1000),
          providerPlayerId: player.providerPlayerId,
          tier: randomInt(1, 3)
        }
      });
    });

    try {
      await Promise.all(promises);
    } catch (err) {
      console.error(err);
    }
  }

  async function seedAutomaticNotificationTemplates() {
    const existingTemplates = await prisma.notificationAutomaticTemplates.findMany();

    if (existingTemplates.length > 0) return;

    const defaultTemplates: Prisma.NotificationAutomaticTemplatesCreateInput[] = [
      {
        type: AutomaticNotificationTypeEnum.NEW_CAMPAIGN,
        title: `New Campaign: {{campaignName}}`,
        content: `A new campaign has been created: {{campaignName}}`
      },
      {
        type: AutomaticNotificationTypeEnum.CAMPAIGN_DEADLINE,
        title: `Campaign Deadline: {{campaignName}}`,
        content: `{{campaignName}} is ending in {{endDate}}`
      },
      {
        type: AutomaticNotificationTypeEnum.END_SEASON,
        title: `Season Ended: {{seasonName}}`,
        content: `{{seasonName}} is ending in {{endDate}}`
      },
      {
        type: AutomaticNotificationTypeEnum.START_SEASON,
        title: `Season Started: {{seasonName}}`,
        content: `{{seasonName}} has started in {{startDate}}`
      },
      {
        type: AutomaticNotificationTypeEnum.REWARD,
        title: `Reward: {{rewardType}}`,
        content: `You earned {{rewardQuantity}} {{rewardType}}}`
      },
      {
        type: AutomaticNotificationTypeEnum.TIER,
        title: `Tier {{changeType}}: {{tier}}`,
        content: `You have been promoted to tier {{tier}}`
      }
    ];

    await prisma.notificationAutomaticTemplates.createMany({
      data: defaultTemplates
    });
  }

  return {
    init,
    seedStaking,
    seedPlayers,
    seedPlayersSeasonPoints,
    seedPlayersTotalPoints,
    seedAutomaticNotificationTemplates
  };
}
