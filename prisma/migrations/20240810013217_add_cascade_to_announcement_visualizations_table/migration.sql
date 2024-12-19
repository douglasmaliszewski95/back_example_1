-- DropForeignKey
ALTER TABLE "tb_annoucement_visualizations" DROP CONSTRAINT "tb_annoucement_visualizations_announcementId_fkey";

-- AddForeignKey
ALTER TABLE "tb_annoucement_visualizations" ADD CONSTRAINT "tb_annoucement_visualizations_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "tb_announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
