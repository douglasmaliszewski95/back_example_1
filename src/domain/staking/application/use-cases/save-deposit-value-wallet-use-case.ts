import { HttpStatus } from "../../../../core/errors/http-status";
import { HttpException } from "../../../../core/errors/HttpException";
import { StakingHistoryRepository } from "../repositories/staking-history-repository";
import { StakingRepository } from "../repositories/staking-repository";
import { StakingDTO } from "../repositories/staking-repository.types";

export class SaveDepositValueWalletUseCase {
  constructor(
    private stakingRepository: StakingRepository,
    private stakingHistoryRepository: StakingHistoryRepository
  ) {}

  execute = async (value: number, wallet: string, txHash: string) => {
    if (value <= 0)
      throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "You have to send the amount to be deposit");

    const tx = await this.stakingHistoryRepository.findByTxHash(txHash);
    if (tx) {
      throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Transaction already processed");
    }

    const staking = await this.stakingRepository.findStakingForPlayer(wallet);
    if (!staking) {
      return await this.createStaking(wallet, value, txHash);
    } else {
      return await this.updateStaking(staking, value, txHash);
    }
  };

  private createStaking = async (wallet: string, valueDeposit: number, txHash: string): Promise<StakingDTO> => {
    const createStaking = await this.stakingRepository.create({
      totalDeposit: valueDeposit,
      currency: "CBL",
      progress: 0,
      wallet
    });
    if (!createStaking)
      throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while trying to create a staking for player");

    await this.insertHistory(createStaking.id, valueDeposit, txHash);

    const position = await this.getPosition(createStaking.id);
    const progress = await this.calculateProgressBar(position.position, position.totalPlayers);
    const valueSum = parseFloat(createStaking.totalDeposit.toString());
    const updateStaking = await this.stakingRepository.update({
      id: createStaking.id,
      progress,
      valueSum
    });

    if (!updateStaking)
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Error while trying to update a staking progress for player"
      );

    return updateStaking;
  };

  private updateStaking = async (staking: StakingDTO, valueDeposit: number, txHash: string): Promise<StakingDTO> => {
    const position = await this.getPosition(staking.id);
    const progress = await this.calculateProgressBar(position.position, position.totalPlayers);
    const valueSum = parseFloat(staking.totalDeposit.toString()) + valueDeposit;
    const updateStaking = await this.stakingRepository.update({
      id: staking.id,
      progress,
      valueSum
    });
    if (!updateStaking)
      throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while trying to update a staking for player");

    await this.insertHistory(staking.id, valueDeposit, txHash);

    return updateStaking;
  };

  private insertHistory = async (stakingId: number, valueDeposit: number, txHash: string): Promise<void> => {
    await this.stakingHistoryRepository.create({
      stakingId,
      tokenDeposit: valueDeposit,
      txHash
    });
  };

  private calculateProgressBar = async (position: number, totalPositions: number): Promise<number> => {
    return 100 - (position / totalPositions) * 100;
  };

  private getPosition = async (stakingId: number): Promise<{ position: number; totalPlayers: number }> => {
    const stakingHistory = await this.stakingHistoryRepository.list();
    const positionIndex = stakingHistory.findIndex(x => x.stakingId === stakingId);
    return {
      position: positionIndex,
      totalPlayers: stakingHistory.length
    };
  };
}
