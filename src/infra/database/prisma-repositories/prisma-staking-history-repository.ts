import { StakingHistoryRepository } from "../../../domain/staking/application/repositories/staking-history-repository";
import {
  StakingHistoryCreate,
  StakingHistoryDTO
} from "../../../domain/staking/application/repositories/staking-history-repository.types";
import { prisma } from "../prisma";

export class PrismaStakingHistoryRepository implements StakingHistoryRepository {
  async create(data: StakingHistoryCreate): Promise<StakingHistoryDTO> {
    const stakingHistory = await prisma.stakingHistory.create({
      data
    });

    return {
      id: stakingHistory.id,
      txHash: stakingHistory.txHash,
      stakingId: stakingHistory.stakingId,
      tokenDeposit: stakingHistory.tokenDeposit.toNumber(),
      createdAt: stakingHistory.createdAt,
      updatedAt: stakingHistory.updatedAt
    };
  }

  async list(): Promise<{ sum: number; stakingId: number }[]> {
    const stakingHistory = await prisma.stakingHistory.groupBy({
      by: ["stakingId"],
      _sum: {
        tokenDeposit: true
      },
      orderBy: {
        _sum: {
          tokenDeposit: "desc"
        }
      }
    });

    return stakingHistory.map(x => {
      return {
        sum: x._sum.tokenDeposit?.toNumber() ?? 0,
        stakingId: x.stakingId
      };
    });
  }

  async listAll(): Promise<StakingHistoryDTO[]> {
    const stakingHistory = await prisma.stakingHistory.findMany();

    return stakingHistory.map(x => {
      return {
        id: x.id,
        txHash: x.txHash,
        stakingId: x.stakingId,
        tokenDeposit: x.tokenDeposit.toNumber(),
        createdAt: x.createdAt,
        updatedAt: x.updatedAt
      };
    });
  }

  async findByTxHash(txHash: string): Promise<StakingHistoryDTO | null> {
    const x = await prisma.stakingHistory.findUnique({
      where: {
        txHash
      }
    });

    if (!x) return null;

    return {
      id: x.id,
      txHash: x.txHash,
      stakingId: x.stakingId,
      tokenDeposit: x.tokenDeposit.toNumber(),
      createdAt: x.createdAt,
      updatedAt: x.updatedAt
    };
  }
}
