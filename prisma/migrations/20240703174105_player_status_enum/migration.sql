-- CreateEnum
CREATE TYPE "PLAYER_STATUS" AS ENUM ('ACTIVE', 'PENDING_PASSWORD', 'PENDING_ACCOUNT', 'PENDING_GALXE');

-- AlterTable
ALTER TABLE "tb_players" ADD COLUMN     "status" "PLAYER_STATUS" NOT NULL DEFAULT 'PENDING_PASSWORD';
