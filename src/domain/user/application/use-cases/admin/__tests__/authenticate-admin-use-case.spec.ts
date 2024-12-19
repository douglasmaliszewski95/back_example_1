import { beforeEach, describe, expect, it } from 'vitest';
import { FakeAuthAdminProvider } from '../../../../../../../tests/auth-provider/fake-auth-admin-provider';
import { makeAdmin } from '../../../../../../../tests/factories/make-admin';
import { AdminStatus } from '../../../../../../core/enums/admin-status-enum';
import { HttpException } from '../../../../../../core/errors/HttpException';
import { AuthenticateAdminUseCase } from '../authenticate-admin-use-case';

let authProvider: FakeAuthAdminProvider;
let sut: AuthenticateAdminUseCase;

describe("Authenticate Admin", () => {

  beforeEach(() => {
    authProvider = new FakeAuthAdminProvider();
    sut = new AuthenticateAdminUseCase(authProvider);
  });

  it("should be able to authenticate a admin", async () => {
    const admin = makeAdmin({
      status: AdminStatus.ACTIVE
    });
    authProvider.signup(admin);

    const response = await sut.execute({
      email: admin.email,
      password: admin.password ?? ""
    });

    expect(response.token).toEqual(expect.any(String));
  });

  it("should not be able to authenticate a user player invalid credentials", async () => {
    await expect(sut.execute({
      email: 'test@test.com',
      password: '123456'
    })).rejects.toBeInstanceOf(HttpException);
  });
})