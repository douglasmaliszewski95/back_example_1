/*
  Warnings:

  - You are about to drop the column `invitedProviderPlayerId` on the `tb_invited_players` table. All the data in the column will be lost.
  - You are about to drop the column `invitingProviderPlayerId` on the `tb_invited_players` table. All the data in the column will be lost.
  - Added the required column `invite_code` to the `tb_invited_players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invited_provider_player_id` to the `tb_invited_players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inviting_provider_player_id` to the `tb_invited_players` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_invited_players" DROP CONSTRAINT "tb_invited_players_invitedProviderPlayerId_fkey";

-- DropForeignKey
ALTER TABLE "tb_invited_players" DROP CONSTRAINT "tb_invited_players_invitingProviderPlayerId_fkey";

-- DropIndex
DROP INDEX "tb_invited_players_invitedProviderPlayerId_idx";

-- DropIndex
DROP INDEX "tb_invited_players_invitingProviderPlayerId_idx";

-- AlterTable
ALTER TABLE "tb_invited_players" DROP COLUMN "invitedProviderPlayerId",
DROP COLUMN "invitingProviderPlayerId",
ADD COLUMN     "invite_code" TEXT NOT NULL,
ADD COLUMN     "invited_provider_player_id" TEXT NOT NULL,
ADD COLUMN     "inviting_provider_player_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "tb_player_invite_codes" (
    "id" SERIAL NOT NULL,
    "invite_code" TEXT NOT NULL,
    "expires_in" TIMESTAMP(3) NOT NULL,
    "provider_player_id" TEXT NOT NULL,
    "accepted_quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_player_invite_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_player_invite_codes_invite_code_key" ON "tb_player_invite_codes"("invite_code");

-- CreateIndex
CREATE INDEX "tb_player_invite_codes_id_idx" ON "tb_player_invite_codes"("id");

-- CreateIndex
CREATE INDEX "tb_player_invite_codes_provider_player_id_idx" ON "tb_player_invite_codes"("provider_player_id");

-- CreateIndex
CREATE INDEX "tb_player_invite_codes_invite_code_idx" ON "tb_player_invite_codes"("invite_code");

-- CreateIndex
CREATE INDEX "tb_player_invite_codes_accepted_quantity_idx" ON "tb_player_invite_codes"("accepted_quantity");

-- CreateIndex
CREATE INDEX "tb_player_invite_codes_expires_in_idx" ON "tb_player_invite_codes"("expires_in");

-- CreateIndex
CREATE INDEX "tb_announcements_title_idx" ON "tb_announcements"("title");

-- CreateIndex
CREATE INDEX "tb_announcements_start_date_idx" ON "tb_announcements"("start_date");

-- CreateIndex
CREATE INDEX "tb_announcements_end_idx" ON "tb_announcements"("end");

-- CreateIndex
CREATE INDEX "tb_announcements_tier_idx" ON "tb_announcements"("tier");

-- CreateIndex
CREATE INDEX "tb_announcements_created_at_idx" ON "tb_announcements"("created_at");

-- CreateIndex
CREATE INDEX "tb_invited_players_invited_provider_player_id_idx" ON "tb_invited_players"("invited_provider_player_id");

-- CreateIndex
CREATE INDEX "tb_invited_players_inviting_provider_player_id_idx" ON "tb_invited_players"("inviting_provider_player_id");

-- CreateIndex
CREATE INDEX "tb_invited_players_created_at_idx" ON "tb_invited_players"("created_at");

-- CreateIndex
CREATE INDEX "tb_player_season_points_last_tier_idx" ON "tb_player_season_points"("last_tier");

-- CreateIndex
CREATE INDEX "tb_player_season_points_progress_idx" ON "tb_player_season_points"("progress");

-- CreateIndex
CREATE INDEX "tb_player_season_points_season_id_idx" ON "tb_player_season_points"("season_id");

-- CreateIndex
CREATE INDEX "tb_player_total_points_progress_idx" ON "tb_player_total_points"("progress");

-- CreateIndex
CREATE INDEX "tb_players_created_at_idx" ON "tb_players"("created_at");

-- CreateIndex
CREATE INDEX "tb_players_status_idx" ON "tb_players"("status");

-- CreateIndex
CREATE INDEX "tb_players_wallet_idx" ON "tb_players"("wallet");

-- CreateIndex
CREATE INDEX "tb_seasons_name_idx" ON "tb_seasons"("name");

-- CreateIndex
CREATE INDEX "tb_seasons_created_at_idx" ON "tb_seasons"("created_at");

-- CreateIndex
CREATE INDEX "tb_systems_system_id_idx" ON "tb_systems"("system_id");

-- CreateIndex
CREATE INDEX "tb_systems_status_idx" ON "tb_systems"("status");

-- CreateIndex
CREATE INDEX "tb_systems_description_idx" ON "tb_systems"("description");

-- CreateIndex
CREATE INDEX "tb_tasks_name_idx" ON "tb_tasks"("name");

-- CreateIndex
CREATE INDEX "tb_tasks_completed_date_idx" ON "tb_tasks"("completed_date");

-- CreateIndex
CREATE INDEX "tb_tasks_created_at_idx" ON "tb_tasks"("created_at");

-- AddForeignKey
ALTER TABLE "tb_invited_players" ADD CONSTRAINT "tb_invited_players_invited_provider_player_id_fkey" FOREIGN KEY ("invited_provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_invited_players" ADD CONSTRAINT "tb_invited_players_inviting_provider_player_id_fkey" FOREIGN KEY ("inviting_provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_player_invite_codes" ADD CONSTRAINT "tb_player_invite_codes_provider_player_id_fkey" FOREIGN KEY ("provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE CASCADE ON UPDATE CASCADE;
