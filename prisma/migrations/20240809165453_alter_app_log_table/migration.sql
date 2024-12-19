-- AlterTable
ALTER TABLE "tb_application_logs" ADD COLUMN     "origin" TEXT;

-- AlterTable
ALTER TABLE "tb_campaigns" ALTER COLUMN "end_date" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "tb_application_logs_origin_idx" ON "tb_application_logs"("origin");
