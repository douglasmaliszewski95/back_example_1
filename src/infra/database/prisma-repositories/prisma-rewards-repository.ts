import { REWARD_TYPE } from "../../../core/enums/rewards-status-enum";
import { RewardsRepository } from "../../../domain/rewards/application/repositories/rewards-repository";
import { RewardsDTO } from "../../../domain/rewards/application/repositories/rewards-repository.types";
import { prisma } from "../prisma";

export class PrismaRewardsRepository implements RewardsRepository {
  async findRewardByName(name: string): Promise<RewardsDTO | null> {
    const type = name.toUpperCase();
    const reward = await prisma.rewards.findFirst({
      where: {
        type: type.includes(REWARD_TYPE.DAILY) ? REWARD_TYPE.DAILY : REWARD_TYPE.WEEKLY
      },
      include: {
        RewardsHistory: true
      }
    });

    return reward;
  }
}
