/*
  Warnings:

  - Made the column `providerPlayerId` on table `tb_players` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tb_players" ALTER COLUMN "providerPlayerId" SET NOT NULL;
