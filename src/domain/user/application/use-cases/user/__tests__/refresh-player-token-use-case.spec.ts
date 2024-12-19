import { describe, beforeEach, it, expect } from "vitest";
import { FakeAuthPlayerProvider } from "../../../../../../../tests/auth-provider/fake-auth-player-provider";
import { makePlayer } from "../../../../../../../tests/factories/make-player";
import { HttpException } from "../../../../../../core/errors/HttpException";
import { RefreshPlayerTokenUseCase } from "../refresh-player-token-use-case";

let authProvider: FakeAuthPlayerProvider;
let sut: RefreshPlayerTokenUseCase;

describe("Refresh token", () => {
  beforeEach(() => {
    authProvider = new FakeAuthPlayerProvider();
    sut = new RefreshPlayerTokenUseCase(authProvider);
  });

  it("should be able to refresh session", async () => {
    const player = makePlayer();
    await authProvider.signup(player);
    const { refreshToken } = await authProvider.signin({
      email: player.email,
      password: player.password || ""
    });

    const response = await sut.execute({
      refreshToken
    });

    expect(response.token).toEqual(expect.any(String));
  });

  it("it should not be able to refresh session without a refresh token", async () => {
    await expect(
      sut.execute({
        refreshToken: ""
      })
    ).rejects.toBeInstanceOf(HttpException);
  });
});
