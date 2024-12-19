/*
  Warnings:

  - You are about to drop the column `provider_player_id` on the `tb_staking` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `tb_staking` table. All the data in the column will be lost.
  - You are about to drop the column `provider_player_id` on the `tb_staking_history` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[txHash]` on the table `tb_staking_history` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tb_staking" DROP COLUMN "provider_player_id",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "tb_staking_history" DROP COLUMN "provider_player_id",
ADD COLUMN     "txHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tb_staking_history_txHash_key" ON "tb_staking_history"("txHash");

-- CreateIndex
CREATE INDEX "tb_staking_history_txHash_idx" ON "tb_staking_history"("txHash");
