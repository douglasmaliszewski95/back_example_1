-- CreateTable
CREATE TABLE "tb_application_logs" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_application_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_application_logs_id_idx" ON "tb_application_logs"("id");

-- CreateIndex
CREATE INDEX "tb_application_logs_level_idx" ON "tb_application_logs"("level");

-- CreateIndex
CREATE INDEX "tb_application_logs_created_at_idx" ON "tb_application_logs"("created_at");
