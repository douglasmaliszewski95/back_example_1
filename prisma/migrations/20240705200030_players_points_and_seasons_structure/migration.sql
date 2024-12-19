-- CreateTable
CREATE TABLE "tb_seasons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerPoints" (
    "id" SERIAL NOT NULL,
    "provider_player_id" TEXT NOT NULL,
    "season_id" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,

    CONSTRAINT "PlayerPoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_seasons_id_idx" ON "tb_seasons"("id");

-- CreateIndex
CREATE INDEX "tb_seasons_start_at_idx" ON "tb_seasons"("start_at");

-- CreateIndex
CREATE INDEX "tb_seasons_end_at_idx" ON "tb_seasons"("end_at");

-- AddForeignKey
ALTER TABLE "PlayerPoints" ADD CONSTRAINT "PlayerPoints_provider_player_id_fkey" FOREIGN KEY ("provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPoints" ADD CONSTRAINT "PlayerPoints_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "tb_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
