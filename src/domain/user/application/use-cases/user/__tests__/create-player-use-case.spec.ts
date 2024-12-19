import { describe, beforeEach, it, expect } from 'vitest';
import { FakeAuthPlayerProvider } from '../../../../../../../tests/auth-provider/fake-auth-player-provider';
import { PlayersRepositoryInMemory } from '../../../../../../../tests/repository/players-repository-in-memory';
import { HttpException } from '../../../../../../core/errors/HttpException';
import { CreatePlayerUseCase } from '../create-player-use-case';

let authProvider: FakeAuthPlayerProvider;
let playersRepository: PlayersRepositoryInMemory;
let sut: CreatePlayerUseCase;

describe("Create user", () => {

  beforeEach(() => {
    authProvider = new FakeAuthPlayerProvider();
    playersRepository = new PlayersRepositoryInMemory();
    sut = new CreatePlayerUseCase(authProvider, playersRepository);
  });

  it("should be able to create a new user", async () => {
    const { player } = await sut.execute({
      email: 'john@doe.com',
      password: 'password-test'
    });

    expect(player.email).toEqual('john@doe.com');
  });

  it("should not be able to create a new user without a email", async () => {
    await expect(sut.execute({
      email: '',
      password: 'password-test'
    })).rejects.toBeInstanceOf(HttpException);
  });
});