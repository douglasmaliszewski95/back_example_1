-- AlterTable
ALTER TABLE "tb_users" ALTER COLUMN "wallet" DROP NOT NULL,
ALTER COLUMN "galxe_discord_id" DROP NOT NULL,
ALTER COLUMN "galxe_twitter_id" DROP NOT NULL,
ALTER COLUMN "galxe_email" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;
