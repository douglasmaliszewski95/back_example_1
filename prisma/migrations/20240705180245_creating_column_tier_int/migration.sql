-- AlterTable
ALTER TABLE "tb_players" ADD COLUMN     "tier" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "tb_players_tier_idx" ON "tb_players"("tier");
