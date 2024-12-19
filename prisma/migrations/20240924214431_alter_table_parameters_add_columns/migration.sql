/*
  Warnings:

  - Added the required column `refreshTokenGalxe` to the `tb_parameters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_parameters" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "refreshTokenGalxe" TEXT NOT NULL;
