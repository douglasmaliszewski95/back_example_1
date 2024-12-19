-- CreateTable
CREATE TABLE "tb_staking" (
    "id" SERIAL NOT NULL,
    "provider_player_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "totalDeposit" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "progress" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_staking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_staking_history" (
    "id" SERIAL NOT NULL,
    "provider_player_id" TEXT NOT NULL,
    "stakingId" INTEGER NOT NULL,
    "tokenDeposit" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_staking_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_staking_id_idx" ON "tb_staking"("id");

-- CreateIndex
CREATE INDEX "tb_staking_history_id_idx" ON "tb_staking_history"("id");

-- CreateIndex
CREATE INDEX "tb_staking_history_stakingId_idx" ON "tb_staking_history"("stakingId");

-- AddForeignKey
ALTER TABLE "tb_staking_history" ADD CONSTRAINT "tb_staking_history_stakingId_fkey" FOREIGN KEY ("stakingId") REFERENCES "tb_staking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
