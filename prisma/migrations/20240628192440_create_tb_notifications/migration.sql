/*
  Warnings:

  - Added the required column `tier` to the `tb_players` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_players" ADD COLUMN     "galxe_id" TEXT,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tier" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "tb_notifications" (
    "id" SERIAL NOT NULL,
    "tier" TEXT[],
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "points" TEXT,
    "status" TEXT,
    "selected_usernames" TEXT,
    "excluded_usernames" TEXT,
    "csv_usernames" TEXT,
    "start_date" TIMESTAMP(3),
    "end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_notifications_registry" (
    "id" SERIAL NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notificationId" INTEGER NOT NULL,

    CONSTRAINT "tb_notifications_registry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_notifications_id_idx" ON "tb_notifications"("id");

-- CreateIndex
CREATE INDEX "tb_notifications_tier_idx" ON "tb_notifications"("tier");

-- CreateIndex
CREATE INDEX "tb_notifications_status_idx" ON "tb_notifications"("status");

-- CreateIndex
CREATE INDEX "tb_notifications_registry_id_idx" ON "tb_notifications_registry"("id");

-- CreateIndex
CREATE INDEX "tb_notifications_registry_recipient_id_idx" ON "tb_notifications_registry"("recipient_id");

-- CreateIndex
CREATE INDEX "tb_notifications_registry_notificationId_idx" ON "tb_notifications_registry"("notificationId");

-- CreateIndex
CREATE INDEX "tb_players_tier_idx" ON "tb_players"("tier");

-- CreateIndex
CREATE INDEX "tb_players_username_idx" ON "tb_players"("username");

-- AddForeignKey
ALTER TABLE "tb_notifications_registry" ADD CONSTRAINT "tb_notifications_registry_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "tb_players"("providerPlayerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_notifications_registry" ADD CONSTRAINT "tb_notifications_registry_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "tb_notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
