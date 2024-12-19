import { beforeEach, describe, expect, it } from 'vitest';
import { FakeAuthAdminProvider } from '../../../../../../../tests/auth-provider/fake-auth-admin-provider';
import { makeAdmin } from '../../../../../../../tests/factories/make-admin';
import { HttpException } from '../../../../../../core/errors/HttpException';
import { DeleteAdminByIdUseCase } from '../delete-admin-by-id-use-case';

let authProvider: FakeAuthAdminProvider;
let sut: DeleteAdminByIdUseCase;

describe("Delete Admin", () => {

  beforeEach(() => {
    authProvider = new FakeAuthAdminProvider();
    sut = new DeleteAdminByIdUseCase(authProvider);
  });

  it("should be able to delete admin", async () => {
    const payload = makeAdmin();
    const admin = await authProvider.signup(payload);
    await sut.execute(admin.data?.id ?? "");

    expect(authProvider.admins.length).toEqual(0);
  });

  it("should not be able to delete a inexistent admin", async () => {
    await expect(sut.execute("")).rejects.toBeInstanceOf(HttpException);
  });
})