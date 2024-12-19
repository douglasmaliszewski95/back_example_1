import { RewardsHistoryRepository } from "../../../domain/rewards/application/repositories/rewards-history-repository";
import {
  RewardsHistoryData,
  RewardsHistoryDTO
} from "../../../domain/rewards/application/repositories/rewards-history-repository.types";
import { prisma } from "../prisma";

export class PrismaRewardsHistoryRepository implements RewardsHistoryRepository {
  async create(data: RewardsHistoryData): Promise<RewardsHistoryDTO> {
    const rewardsHistory = await prisma.rewardsHistory.create({
      data: {
        providerPlayerId: data.providerPlayerId,
        rewardId: data.rewardId,
        points: data.rewardPoints,
        availableAt: data.availableDate
      }
    });

    return {
      id: rewardsHistory.id,
      providerPlayerId: rewardsHistory.providerPlayerId,
      rewardId: rewardsHistory.rewardId,
      points: rewardsHistory.points,
      createdAt: rewardsHistory.createdAt,
      availableAt: rewardsHistory.availableAt
    };
  }

  async list(providerPlayerId: string): Promise<RewardsHistoryDTO[]> {
    const rewardsHistory = await prisma.rewardsHistory.findMany({
      where: {
        providerPlayerId
      }
    });

    return rewardsHistory;
  }
}
