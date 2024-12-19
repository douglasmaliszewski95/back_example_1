import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateAdminInfoUseCase } from '../update-admin-info-use-case';
import { FakeAuthAdminProvider } from '../../../../../../../tests/auth-provider/fake-auth-admin-provider';
import { makeAdmin } from '../../../../../../../tests/factories/make-admin';
import { HttpException } from '../../../../../../core/errors/HttpException';

let authProvider: FakeAuthAdminProvider;
let sut: UpdateAdminInfoUseCase;

describe("Update Admin Info", () => {

  beforeEach(() => {
    authProvider = new FakeAuthAdminProvider();
    sut = new UpdateAdminInfoUseCase(authProvider);
  });

  it("should be able to update admin info", async () => {
    const payload = makeAdmin();
    const admin = await authProvider.signup(payload);
    const response = await sut.execute(admin.data?.id ?? "", {
      fullname: 'test-1'
    });

    expect(response.fullname).toEqual('test-1');
  });

  it("should not be able to update a inexistent admin", async () => {
    await expect(sut.execute("", {
      fullname: 'test-1'
    })).rejects.toBeInstanceOf(HttpException);
  });
})