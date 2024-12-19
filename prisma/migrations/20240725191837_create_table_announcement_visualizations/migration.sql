-- CreateTable
CREATE TABLE "tb_annoucement_visualizations" (
    "id" SERIAL NOT NULL,
    "announcementId" INTEGER NOT NULL,
    "providerPlayerId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_annoucement_visualizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_annoucement_visualizations_id_idx" ON "tb_annoucement_visualizations"("id");

-- CreateIndex
CREATE INDEX "tb_annoucement_visualizations_providerPlayerId_idx" ON "tb_annoucement_visualizations"("providerPlayerId");

-- CreateIndex
CREATE INDEX "tb_annoucement_visualizations_announcementId_idx" ON "tb_annoucement_visualizations"("announcementId");

-- AddForeignKey
ALTER TABLE "tb_annoucement_visualizations" ADD CONSTRAINT "tb_annoucement_visualizations_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "tb_announcements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
