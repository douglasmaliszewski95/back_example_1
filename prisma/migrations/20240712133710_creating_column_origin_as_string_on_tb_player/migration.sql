-- AlterTable
ALTER TABLE "tb_players" ADD COLUMN     "origin" TEXT NOT NULL DEFAULT 'email';

-- DropEnum
DROP TYPE "PLAYER_ORIGIN";
