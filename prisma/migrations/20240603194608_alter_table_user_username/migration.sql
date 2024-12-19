/*
  Warnings:

  - Made the column `username` on table `tb_users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tb_users" ALTER COLUMN "username" SET NOT NULL;
