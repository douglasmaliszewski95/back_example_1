/*
  Warnings:

  - You are about to drop the column `active` on the `tb_systems` table. All the data in the column will be lost.
  - You are about to drop the column `auth_user_id` on the `tb_tasks` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `tb_tasks` table. All the data in the column will be lost.
  - You are about to drop the `tb_users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `provider_player_id` to the `tb_tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `system_id` to the `tb_tasks` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `points` on the `tb_tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SYSTEM_STATUS" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "tb_tasks" DROP CONSTRAINT "tb_tasks_userId_fkey";

-- DropIndex
DROP INDEX "tb_tasks_auth_user_id_idx";

-- AlterTable
ALTER TABLE "tb_systems" DROP COLUMN "active",
ADD COLUMN     "status" "SYSTEM_STATUS" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "tb_tasks" DROP COLUMN "auth_user_id",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "provider_player_id" TEXT NOT NULL,
ADD COLUMN     "system_id" TEXT NOT NULL,
ALTER COLUMN "task_id" DROP NOT NULL,
DROP COLUMN "points",
ADD COLUMN     "points" INTEGER NOT NULL;

-- DropTable
DROP TABLE "tb_users";

-- CreateTable
CREATE TABLE "tb_players" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT,
    "galxe_discord_id" TEXT,
    "galxe_twitter_id" TEXT,
    "galxe_email" TEXT,
    "username" TEXT NOT NULL,
    "providerPlayerId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_players_username_key" ON "tb_players"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tb_players_providerPlayerId_key" ON "tb_players"("providerPlayerId");

-- CreateIndex
CREATE INDEX "tb_players_id_idx" ON "tb_players"("id");

-- CreateIndex
CREATE INDEX "tb_players_providerPlayerId_idx" ON "tb_players"("providerPlayerId");

-- CreateIndex
CREATE INDEX "tb_tasks_provider_player_id_idx" ON "tb_tasks"("provider_player_id");
