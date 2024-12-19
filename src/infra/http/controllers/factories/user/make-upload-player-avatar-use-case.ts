import { UploadPlayerAvatarUseCase } from "../../../../../domain/user/application/use-cases/user/upload-player-avatar-use-case";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { SupabaseFileStorage } from "../../../../storage/supabase-file-storage";

export function makeUploadPlayerAvatarUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const storage = new SupabaseFileStorage();
  const sut = new UploadPlayerAvatarUseCase(playersRepository, storage);
  return sut;
}