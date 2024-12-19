-- CreateTable
CREATE TABLE "tb_parameters" (
    "id" SERIAL NOT NULL,
    "galxe_id" TEXT,
    "userId" TEXT NOT NULL,
    "termsAccepted" BOOLEAN NOT NULL,

    CONSTRAINT "tb_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_parameters_userId_key" ON "tb_parameters"("userId");
