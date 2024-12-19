-- AlterEnum
ALTER TYPE "PLAYER_STATUS" ADD VALUE 'BANNED';

-- AlterTable
ALTER TABLE "tb_players" ADD COLUMN     "reason" TEXT;
