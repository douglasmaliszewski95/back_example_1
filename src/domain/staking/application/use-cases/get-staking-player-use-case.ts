import { StakingHistoryRepository } from "../repositories/staking-history-repository";
import { StakingRepository } from "../repositories/staking-repository";

export class GetStakingPlayerUseCase {
  constructor(
    private stakingRepository: StakingRepository,
    private stakingHistoryRepository: StakingHistoryRepository
  ) {}

  execute = async (wallet: string) => {
    const staking = await this.stakingRepository.findStakingForPlayer(wallet);

    let position;

    if (staking) {
      position = await this.getPosition(staking.id);
    }

    const stakingHistory = await this.stakingHistoryRepository.listAll();
    const historyTotal = stakingHistory.reduce((acc, curr) => acc + curr.tokenDeposit, 0);

    const totalStaked = parseFloat(((historyTotal * 100) / 10000000).toFixed(2));

    return {
      id: staking?.id,
      totalDeposit: staking?.totalDeposit,
      currency: staking?.currency,
      progress: staking?.progress,
      wallet: staking?.wallet,
      createdAt: staking?.createdAt,
      updatedAt: staking?.updatedAt,
      position,
      totalStaked: totalStaked < 0.01 ? 0.01 : totalStaked
    };
  };

  private getPosition = async (stakingId: number): Promise<string> => {
    const stakingHistory = await this.stakingHistoryRepository.list();
    const positionIndex = stakingHistory.findIndex(x => x.stakingId === stakingId);
    const position = positionIndex + 1;
    const lastDigit = position % 10;
    const lastTwoDigits = position % 100;

    if (lastTwoDigits === 11 || lastTwoDigits === 12 || lastTwoDigits === 13) {
      return `${position}th`;
    }

    if (lastTwoDigits.toString().length >= 2) {
      const finalDigit = lastTwoDigits % 10;
      if (finalDigit === 1) return `${position}st`;
      else return `${position}th`;
    }

    switch (lastDigit) {
      case 1:
        return `${position}st`;
      case 2:
        return `${position}nd`;
      case 3:
        return `${position}rd`;
      default:
        return `${position}th`;
    }
  };
}
