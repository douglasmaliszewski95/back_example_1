-- CreateTable
CREATE TABLE "tb_player_registered_devices" (
    "id" SERIAL NOT NULL,
    "provider_player_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_player_registered_devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_player_registered_devices_id_idx" ON "tb_player_registered_devices"("id");

-- CreateIndex
CREATE INDEX "tb_player_registered_devices_provider_player_id_idx" ON "tb_player_registered_devices"("provider_player_id");

-- AddForeignKey
ALTER TABLE "tb_player_registered_devices" ADD CONSTRAINT "tb_player_registered_devices_provider_player_id_fkey" FOREIGN KEY ("provider_player_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE CASCADE ON UPDATE CASCADE;