import { StakingRepository } from "../../../domain/staking/application/repositories/staking-repository";
import {
  StakingCreate,
  StakingDTO,
  StakingUpdate
} from "../../../domain/staking/application/repositories/staking-repository.types";
import { prisma } from "../prisma";

export class PrismaStakingRepository implements StakingRepository {
  async findStakingForPlayer(wallet: string): Promise<StakingDTO | null> {
    const staking = await prisma.staking.findFirst({
      where: {
        wallet
      },
      include: {
        StakingHistory: true
      }
    });

    if (!staking) return null;

    const stakingHistory =
      staking.StakingHistory.length > 0
        ? staking.StakingHistory.map(item => {
            return {
              id: item.id,
              stakingId: item.stakingId,
              tokenDeposit: item.tokenDeposit as unknown as number,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            };
          })
        : undefined;

    return {
      id: staking.id,
      totalDeposit: staking.totalDeposit as unknown as number,
      currency: staking.currency,
      progress: staking.progress as unknown as number,
      wallet: staking.wallet as string,
      StakingHistory: stakingHistory,
      createdAt: staking.createdAt,
      updatedAt: staking.updatedAt
    };
  }

  async create(data: StakingCreate): Promise<StakingDTO | null> {
    const staking = await prisma.staking.create({
      data
    });

    return {
      id: staking.id,
      totalDeposit: staking.totalDeposit as unknown as number,
      currency: staking.currency,
      progress: staking.progress as unknown as number,
      wallet: staking.wallet as string,
      createdAt: staking.createdAt,
      updatedAt: staking.updatedAt
    };
  }

  async update(data: StakingUpdate): Promise<StakingDTO | null> {
    const staking = await prisma.staking.update({
      where: {
        id: data.id
      },
      data: {
        progress: data.progress,
        totalDeposit: data.valueSum,
        updatedAt: new Date()
      }
    });

    return {
      id: staking.id,
      totalDeposit: staking.totalDeposit as unknown as number,
      currency: staking.currency,
      progress: staking.progress as unknown as number,
      wallet: staking.wallet as string,
      createdAt: staking.createdAt,
      updatedAt: staking.updatedAt
    };
  }
}
