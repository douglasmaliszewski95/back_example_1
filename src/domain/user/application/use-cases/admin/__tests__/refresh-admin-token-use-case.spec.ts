import { describe, beforeEach, it, expect } from 'vitest';
import { FakeAuthAdminProvider } from '../../../../../../../tests/auth-provider/fake-auth-admin-provider';
import { makeAdmin } from '../../../../../../../tests/factories/make-admin';
import { AdminStatus } from '../../../../../../core/enums/admin-status-enum';
import { HttpException } from '../../../../../../core/errors/HttpException';
import { RefreshAdminTokenUseCase } from '../refresh-admin-token-use-case';

let authProvider: FakeAuthAdminProvider;
let sut: RefreshAdminTokenUseCase;

describe("Refresh token", () => {

  beforeEach(() => {
    authProvider = new FakeAuthAdminProvider();
    sut = new RefreshAdminTokenUseCase(authProvider);
  });

  it("should be able to refresh session", async () => {
    const admin = makeAdmin({
      status: AdminStatus.ACTIVE
    });
    await authProvider.signup(admin);
    const { refreshToken } = await authProvider.signin({
      email: admin.email,
      password: admin.password ?? ""
    });

    const response = await sut.execute({
      refreshToken
    });

    expect(response.token).toEqual(expect.any(String));
  });

  it("it should not be able to refresh session without a refresh token", async () => {
    await expect(sut.execute({
      refreshToken: ""
    })).rejects.toBeInstanceOf(HttpException);
  });
});