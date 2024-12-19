import { beforeEach, describe, expect, it } from "vitest";
import { FakeAuthPlayerProvider } from "../../../../../../../tests/auth-provider/fake-auth-player-provider";
import { makePlayer } from "../../../../../../../tests/factories/make-player";
import { HttpException } from "../../../../../../core/errors/HttpException";
import { AuthenticatePlayerUseCase } from "../authenticate-player-use-case";

let authProvider: FakeAuthPlayerProvider;
let sut: AuthenticatePlayerUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    authProvider = new FakeAuthPlayerProvider();
    sut = new AuthenticatePlayerUseCase(authProvider);
  });

  it("should be able to authenticate a player", async () => {
    const player = makePlayer();
    authProvider.signup(player);

    const response = await sut.execute({
      email: player.email,
      password: player.password || ""
    });

    expect(response.token).toEqual(expect.any(String));
  });

  it("should not be able to authenticate a user player invalid credentials", async () => {
    await expect(
      sut.execute({
        email: "test@test.com",
        password: "123456"
      })
    ).rejects.toBeInstanceOf(HttpException);
  });
});
