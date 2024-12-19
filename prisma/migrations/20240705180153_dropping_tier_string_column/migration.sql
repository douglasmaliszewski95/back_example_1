/*
  Warnings:

  - You are about to drop the column `tier` on the `tb_players` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tb_players_tier_idx";

-- AlterTable
ALTER TABLE "tb_players" DROP COLUMN "tier";
