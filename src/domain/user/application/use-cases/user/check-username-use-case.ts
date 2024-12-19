import { PlayersRepository } from "../../repositories/players-repository";

export class CheckUsernameUseCase {
  constructor(private playersRepository: PlayersRepository) { }

  execute = async (username: string): Promise<{ valid: boolean }> => {
    const usernameAlreadyRegistered = await this.playersRepository.findByUsername(username);
    if (usernameAlreadyRegistered) return { valid: false }
    return { valid: true };
  }
}