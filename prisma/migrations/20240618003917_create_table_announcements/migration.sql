-- AlterTable
ALTER TABLE "tb_systems" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "tb_announcements" (
    "id" SERIAL NOT NULL,
    "tier" TEXT[],
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end" TIMESTAMP(3),
    "banner_url" TEXT NOT NULL,
    "banner_extension" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_announcements_pkey" PRIMARY KEY ("id")
);
