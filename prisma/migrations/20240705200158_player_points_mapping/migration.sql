/*
  Warnings:

  - You are about to drop the `PlayerPoints` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlayerPoints" DROP CONSTRAINT "PlayerPoints_provider_player_id_fkey";

-- DropForeignKey
ALTER TABLE "PlayerPoints" DROP CONSTRAINT "PlayerPoints_season_id_fkey";

-- DropTable
DROP TABLE "PlayerPoints";

-- CreateTable
CREATE TABLE "tb_player_points" (
    "id" SERIAL NOT NULL,
    "provider_player_id" TEXT NOT NULL,
    "season_id" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,

    CONSTRAINT "tb_player_points_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_player_points" ADD CONSTRAINT "tb_player_points_provider_player_id_fkey" FOREIGN KEY ("provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_player_points" ADD CONSTRAINT "tb_player_points_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "tb_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
