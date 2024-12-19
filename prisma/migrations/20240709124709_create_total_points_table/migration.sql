/*
  Warnings:

  - You are about to drop the `tb_player_points` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_player_points" DROP CONSTRAINT "tb_player_points_provider_player_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_player_points" DROP CONSTRAINT "tb_player_points_season_id_fkey";

-- AlterTable
ALTER TABLE "tb_tasks" ADD COLUMN     "seasonId" INTEGER;

-- DropTable
DROP TABLE "tb_player_points";

-- CreateTable
CREATE TABLE "tb_player_season_points" (
    "id" SERIAL NOT NULL,
    "provider_player_id" TEXT NOT NULL,
    "season_id" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,

    CONSTRAINT "tb_player_season_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_player_total_points" (
    "id" SERIAL NOT NULL,
    "provider_player_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,
    "tier_last_updated_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_player_total_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_player_season_points_id_idx" ON "tb_player_season_points"("id");

-- CreateIndex
CREATE INDEX "tb_player_season_points_points_idx" ON "tb_player_season_points"("points");

-- CreateIndex
CREATE INDEX "tb_player_season_points_tier_idx" ON "tb_player_season_points"("tier");

-- CreateIndex
CREATE INDEX "tb_player_total_points_id_idx" ON "tb_player_total_points"("id");

-- CreateIndex
CREATE INDEX "tb_player_total_points_points_idx" ON "tb_player_total_points"("points");

-- CreateIndex
CREATE INDEX "tb_player_total_points_tier_idx" ON "tb_player_total_points"("tier");

-- AddForeignKey
ALTER TABLE "tb_player_season_points" ADD CONSTRAINT "tb_player_season_points_provider_player_id_fkey" FOREIGN KEY ("provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_player_season_points" ADD CONSTRAINT "tb_player_season_points_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "tb_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_player_total_points" ADD CONSTRAINT "tb_player_total_points_provider_player_id_fkey" FOREIGN KEY ("provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE RESTRICT ON UPDATE CASCADE;
