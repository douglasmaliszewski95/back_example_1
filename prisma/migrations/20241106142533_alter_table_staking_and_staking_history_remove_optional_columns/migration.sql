/*
  Warnings:

  - Made the column `wallet` on table `tb_staking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `txHash` on table `tb_staking_history` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tb_staking" ALTER COLUMN "wallet" SET NOT NULL;

-- AlterTable
ALTER TABLE "tb_staking_history" ALTER COLUMN "txHash" SET NOT NULL;
