-- CreateEnum
CREATE TYPE "AUTOMATIC_NOTIFICATION_TYPE" AS ENUM ('NEW_CAMPAIGN', 'CAMPAIGN_DEADLINE', 'START_SEASON', 'END_SEASON', 'REWARD', 'TIER');

-- CreateTable
CREATE TABLE "tb_notification_automatic_templates" (
    "id" SERIAL NOT NULL,
    "type" "AUTOMATIC_NOTIFICATION_TYPE" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "tb_notification_automatic_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_notification_automatic_templates_id_idx" ON "tb_notification_automatic_templates"("id");

-- CreateIndex
CREATE INDEX "tb_notification_automatic_templates_type_idx" ON "tb_notification_automatic_templates"("type");
