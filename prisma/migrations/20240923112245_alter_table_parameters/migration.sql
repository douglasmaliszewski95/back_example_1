/*
  Warnings:

  - Added the required column `refreshToken` to the `tb_parameters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_parameters" ADD COLUMN     "refreshToken" TEXT NOT NULL;
