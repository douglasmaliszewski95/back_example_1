-- AlterTable
ALTER TABLE "tb_player_season_points" ADD COLUMN     "progress" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tb_player_total_points" ADD COLUMN     "progress" DECIMAL(65,30) NOT NULL DEFAULT 0;
