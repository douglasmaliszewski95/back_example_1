-- DropForeignKey
ALTER TABLE "tb_invited_players" DROP CONSTRAINT "tb_invited_players_invitedProviderPlayerId_fkey";

-- DropForeignKey
ALTER TABLE "tb_invited_players" DROP CONSTRAINT "tb_invited_players_invitingProviderPlayerId_fkey";

-- DropForeignKey
ALTER TABLE "tb_notifications_registry" DROP CONSTRAINT "tb_notifications_registry_recipient_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_player_season_points" DROP CONSTRAINT "tb_player_season_points_provider_player_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_player_total_points" DROP CONSTRAINT "tb_player_total_points_provider_player_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_tasks" DROP CONSTRAINT "tb_tasks_provider_player_id_fkey";

-- AddForeignKey
ALTER TABLE "tb_tasks" ADD CONSTRAINT "tb_tasks_provider_player_id_fkey" FOREIGN KEY ("provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_notifications_registry" ADD CONSTRAINT "tb_notifications_registry_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_player_season_points" ADD CONSTRAINT "tb_player_season_points_provider_player_id_fkey" FOREIGN KEY ("provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_player_total_points" ADD CONSTRAINT "tb_player_total_points_provider_player_id_fkey" FOREIGN KEY ("provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_invited_players" ADD CONSTRAINT "tb_invited_players_invitedProviderPlayerId_fkey" FOREIGN KEY ("invitedProviderPlayerId") REFERENCES "tb_players"("providerPlayerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_invited_players" ADD CONSTRAINT "tb_invited_players_invitingProviderPlayerId_fkey" FOREIGN KEY ("invitingProviderPlayerId") REFERENCES "tb_players"("providerPlayerId") ON DELETE CASCADE ON UPDATE CASCADE;
