-- AddForeignKey
ALTER TABLE "tb_tasks" ADD CONSTRAINT "tb_tasks_provider_player_id_fkey" FOREIGN KEY ("provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE RESTRICT ON UPDATE CASCADE;
