/*
  Warnings:

  - A unique constraint covering the columns `[provider_player_id]` on the table `tb_player_total_points` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_player_total_points_provider_player_id_key" ON "tb_player_total_points"("provider_player_id");
