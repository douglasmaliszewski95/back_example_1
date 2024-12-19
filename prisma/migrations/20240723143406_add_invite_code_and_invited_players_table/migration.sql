/*
  Warnings:

  - A unique constraint covering the columns `[invite_code]` on the table `tb_players` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tb_players" ADD COLUMN     "invite_code" TEXT;

-- CreateTable
CREATE TABLE "tb_invited_players" (
    "id" SERIAL NOT NULL,
    "invitedProviderPlayerId" TEXT NOT NULL,
    "invitingProviderPlayerId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_invited_players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tb_invited_players_id_idx" ON "tb_invited_players"("id");

-- CreateIndex
CREATE INDEX "tb_invited_players_invitedProviderPlayerId_idx" ON "tb_invited_players"("invitedProviderPlayerId");

-- CreateIndex
CREATE INDEX "tb_invited_players_invitingProviderPlayerId_idx" ON "tb_invited_players"("invitingProviderPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_players_invite_code_key" ON "tb_players"("invite_code");

-- CreateIndex
CREATE INDEX "tb_players_invite_code_idx" ON "tb_players"("invite_code");

-- AddForeignKey
ALTER TABLE "tb_invited_players" ADD CONSTRAINT "tb_invited_players_invitedProviderPlayerId_fkey" FOREIGN KEY ("invitedProviderPlayerId") REFERENCES "tb_players"("providerPlayerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_invited_players" ADD CONSTRAINT "tb_invited_players_invitingProviderPlayerId_fkey" FOREIGN KEY ("invitingProviderPlayerId") REFERENCES "tb_players"("providerPlayerId") ON DELETE RESTRICT ON UPDATE CASCADE;
