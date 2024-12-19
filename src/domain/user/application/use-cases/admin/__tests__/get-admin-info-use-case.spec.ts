import { describe, beforeEach, it, expect } from 'vitest';
import { FakeAuthAdminProvider } from '../../../../../../../tests/auth-provider/fake-auth-admin-provider';
import { makeAdmin } from '../../../../../../../tests/factories/make-admin';
import { AdminStatus } from '../../../../../../core/enums/admin-status-enum';
import { HttpException } from '../../../../../../core/errors/HttpException';
import { GetAdminInfoUseCase } from '../get-admin-info-use-case';

let authProvider: FakeAuthAdminProvider;
let sut: GetAdminInfoUseCase;

describe("Get Player Info", () => {

  beforeEach(() => {
    authProvider = new FakeAuthAdminProvider();
    sut = new GetAdminInfoUseCase(authProvider);
  });

  it("should be able to retrieve a player info", async () => {
    const admin = makeAdmin({
      status: AdminStatus.ACTIVE
    });
    await authProvider.signup(admin);
    const { token } = await authProvider.signin({
      email: admin.email,
      password: admin.password ?? ""
    });

    const response = await sut.execute({
      token: `Bearer ${token}`
    });

    expect(response?.email).toEqual(admin.email);
  });

  it("should not be able to find a player without a id", async () => {
    await expect(sut.execute({ token: "" })).rejects.toBeInstanceOf(HttpException);
  })

  it("should not be able to find a non-existing user by id", async () => {
    await expect(sut.execute({ token: "test-token" })).rejects.toBeInstanceOf(HttpException);
  });
});