/*
  Warnings:

  - The `tier` column on the `tb_announcements` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tb_announcements" DROP COLUMN "tier",
ADD COLUMN     "tier" INTEGER[];
