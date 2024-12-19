-- CreateEnum
CREATE TYPE "REWARD_TYPE" AS ENUM ('DAILY', 'WEEKLY');

-- CreateTable
CREATE TABLE "tb_rewards" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "REWARD_TYPE" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "points" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_rewards_history" (
    "id" SERIAL NOT NULL,
    "provider_player_id" TEXT NOT NULL,
    "rewardId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_rewards_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_rewards_id_idx" ON "tb_rewards"("id");

-- CreateIndex
CREATE INDEX "tb_rewards_history_id_idx" ON "tb_rewards_history"("id");

-- CreateIndex
CREATE INDEX "tb_rewards_history_rewardId_idx" ON "tb_rewards_history"("rewardId");

-- AddForeignKey
ALTER TABLE "tb_rewards_history" ADD CONSTRAINT "tb_rewards_history_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "tb_rewards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
