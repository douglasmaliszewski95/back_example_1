-- CreateTable
CREATE TABLE "tb_campaigns" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_campaigns_id_idx" ON "tb_campaigns"("id");

-- CreateIndex
CREATE INDEX "tb_campaigns_external_id_idx" ON "tb_campaigns"("external_id");

-- CreateIndex
CREATE INDEX "tb_campaigns_active_idx" ON "tb_campaigns"("active");

-- CreateIndex
CREATE INDEX "tb_campaigns_start_date_idx" ON "tb_campaigns"("start_date");

-- CreateIndex
CREATE INDEX "tb_campaigns_end_date_idx" ON "tb_campaigns"("end_date");
