-- CreateIndex
CREATE INDEX "tb_announcements_id_idx" ON "tb_announcements"("id");

-- CreateIndex
CREATE INDEX "tb_player_season_points_provider_player_id_idx" ON "tb_player_season_points"("provider_player_id");

-- CreateIndex
CREATE INDEX "tb_player_total_points_provider_player_id_idx" ON "tb_player_total_points"("provider_player_id");

-- CreateIndex
CREATE INDEX "tb_seasons_active_idx" ON "tb_seasons"("active");

-- CreateIndex
CREATE INDEX "tb_tasks_system_id_idx" ON "tb_tasks"("system_id");

-- CreateIndex
CREATE INDEX "tb_tasks_seasonId_idx" ON "tb_tasks"("seasonId");
