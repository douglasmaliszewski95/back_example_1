import { FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../../../../core/errors/HttpException";
import { Contract, EventLog, formatEther, JsonRpcProvider } from "ethers";
import { makeSaveDepositValueWalletUseCase } from "../factories/staking/make-save-deposit-value-wallet-use-case";
import { PrismaApplicationLogRepository } from "../../../database/prisma-repositories/prisma-application-log-repository";
import { LogLevel, LogOrigin } from "../../../../core/enums/log-enum";

const erc4626 = ["event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)"];

const contractAddresses = (process.env.STAKING_CONTRACT_ADDRESSE ?? "").split(",");

export const getDeposits = async () => {
  if (contractAddresses[0] === "") return [];

  const ret = [];

  for (const contractAddress of contractAddresses) {
    const deposits = await getContractDeposits(contractAddress);

    for (const deposit of deposits) {
      ret.push({
        owner: deposit.args[1] as string,
        assets: parseInt(formatEther(deposit.args[2])),
        txHash: deposit.transactionHash
      });
    }
  }

  return ret;
};

export const getContractDeposits = async (contractAddress: string) => {
  const provider = new JsonRpcProvider(process.env.ETHERS_PROVIDER_URL);
  const contract = new Contract(contractAddress, erc4626, provider);

  return (await contract.queryFilter(contract.filters.Deposit())) as EventLog[];
};

export class SaveDepositValuesController {
  handle = async (req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
    const applicationRepo = new PrismaApplicationLogRepository();
    try {
      const save = makeSaveDepositValueWalletUseCase();
      const deposits = await getDeposits();

      for (const deposit of deposits) {
        try {
          await save.execute(deposit.assets, deposit.owner, deposit.txHash);
        } catch (e) {
          await applicationRepo.create({
            content: "error while saving deposit",
            level: LogLevel.ERROR,
            origin: LogOrigin.SAVE_DEPOSIT_VALUES
          });
        }
      }

      return res.status(200).send("save deposits triggered");
    } catch (err) {
      if (err instanceof HttpException) return res.status(err.status).send(err.message);
      console.log(`save deposits error`, err);
      return res.status(400).send("error triggering save deposits");
    }
  };
}
