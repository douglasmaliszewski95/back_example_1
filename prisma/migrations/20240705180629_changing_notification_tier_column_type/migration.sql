/*
  Warnings:

  - The `tier` column on the `tb_notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tb_notifications" DROP COLUMN "tier",
ADD COLUMN     "tier" INTEGER[];

-- CreateIndex
CREATE INDEX "tb_notifications_tier_idx" ON "tb_notifications"("tier");
