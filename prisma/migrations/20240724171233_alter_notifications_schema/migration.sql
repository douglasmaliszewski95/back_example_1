/*
  Warnings:

  - You are about to drop the column `csv_usernames` on the `tb_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `end` on the `tb_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `excluded_usernames` on the `tb_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `tb_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `selected_usernames` on the `tb_notifications` table. All the data in the column will be lost.
  - The `status` column on the `tb_notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `notificationId` on the `tb_notifications_registry` table. All the data in the column will be lost.
  - Added the required column `notification_id` to the `tb_notifications_registry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NOTIFICATON_STATUS" AS ENUM ('ACTIVE', 'DRAFT', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "NOTIFICATION_TYPE" AS ENUM ('AUTOMATIC', 'MANUAL');

-- DropForeignKey
ALTER TABLE "tb_notifications_registry" DROP CONSTRAINT "tb_notifications_registry_notificationId_fkey";

-- DropIndex
DROP INDEX "tb_notifications_status_idx";

-- DropIndex
DROP INDEX "tb_notifications_registry_notificationId_idx";

-- AlterTable
ALTER TABLE "tb_notifications" DROP COLUMN "csv_usernames",
DROP COLUMN "end",
DROP COLUMN "excluded_usernames",
DROP COLUMN "points",
DROP COLUMN "selected_usernames",
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "type" "NOTIFICATION_TYPE" NOT NULL DEFAULT 'MANUAL',
DROP COLUMN "status",
ADD COLUMN     "status" "NOTIFICATON_STATUS" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "tb_notifications_registry" DROP COLUMN "notificationId",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notification_id" INTEGER NOT NULL,
ADD COLUMN     "read_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "tb_notifications_target_points" (
    "id" SERIAL NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "start_points" INTEGER NOT NULL,
    "end_points" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_notifications_target_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_notifications_target_points_id_idx" ON "tb_notifications_target_points"("id");

-- CreateIndex
CREATE INDEX "tb_notifications_target_points_notification_id_idx" ON "tb_notifications_target_points"("notification_id");

-- CreateIndex
CREATE INDEX "tb_notifications_registry_notification_id_idx" ON "tb_notifications_registry"("notification_id");

-- AddForeignKey
ALTER TABLE "tb_notifications_target_points" ADD CONSTRAINT "tb_notifications_target_points_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "tb_notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_notifications_registry" ADD CONSTRAINT "tb_notifications_registry_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "tb_notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
