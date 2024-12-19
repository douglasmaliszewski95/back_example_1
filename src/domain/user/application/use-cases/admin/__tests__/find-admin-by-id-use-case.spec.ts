import { describe, beforeEach, it, expect } from 'vitest';
import { FakeAuthAdminProvider } from '../../../../../../../tests/auth-provider/fake-auth-admin-provider';
import { makeAdmin } from '../../../../../../../tests/factories/make-admin';
import { AdminStatus } from '../../../../../../core/enums/admin-status-enum';
import { HttpException } from '../../../../../../core/errors/HttpException';
import { FindAdminByIdUseCase } from '../find-admin-by-id-use-case';

let authProvider: FakeAuthAdminProvider;
let sut: FindAdminByIdUseCase;

describe("Find Admin by Id", () => {

  beforeEach(() => {
    authProvider = new FakeAuthAdminProvider();
    sut = new FindAdminByIdUseCase(authProvider);
  });

  it("should be able to find a existing player by id", async () => {
    const adminPayload = makeAdmin({
      status: AdminStatus.ACTIVE
    });
    const admin = await authProvider.signup(adminPayload);
    const response = await sut.execute(admin.data?.id ?? "");
    expect(response?.fullname).toEqual(admin.data?.fullname);
  });

  it("should not be able to find a player without a id", async () => {
    await expect(sut.execute("")).rejects.toBeInstanceOf(HttpException);
  })

  it("should not be able to find a non-existing player by id", async () => {
    await expect(sut.execute("test-id")).rejects.toBeInstanceOf(HttpException);
  });
});