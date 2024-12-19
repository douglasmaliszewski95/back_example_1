import { describe, beforeEach, it, expect } from 'vitest';
import { FakeAuthAdminProvider } from '../../../../../../../tests/auth-provider/fake-auth-admin-provider';
import { makeAdmin } from '../../../../../../../tests/factories/make-admin';
import { ListAdminsUseCase } from '../list-admins-use-case';
import { AdminStatus } from '../../../../../../core/enums/admin-status-enum';

let authProvider: FakeAuthAdminProvider;
let sut: ListAdminsUseCase;

describe("List admins", () => {
  beforeEach(() => {
    authProvider = new FakeAuthAdminProvider();
    sut = new ListAdminsUseCase(authProvider);
  });

  it('should be able to return a paginated list of admins', async () => {
    const admin = makeAdmin();
    await authProvider.signup(admin);

    const response = await sut.execute({
      page: 1,
      limit: 10,
    });

    expect(response.list).toHaveLength(1);
  });

  it('should return a empty list if there is no players to return', async () => {
    const response = await sut.execute({
      page: 1,
      limit: 10,
    });

    expect(response.list).toHaveLength(0);
  });

  it("should be able to paginate the list of admins", async () => {
    for (let i = 0; i < 30; i++) {
      const admin = makeAdmin({
        email: `test-${i}@email.com`
      });
      await authProvider.signup(admin);
    }

    const response = await sut.execute({
      page: 2,
      limit: 10,
    });

    expect(response.total).toEqual(30);
    expect(response.list).toEqual([
      expect.objectContaining({ email: 'test-10@email.com' }),
      expect.objectContaining({ email: 'test-11@email.com' }),
      expect.objectContaining({ email: 'test-12@email.com' }),
      expect.objectContaining({ email: 'test-13@email.com' }),
      expect.objectContaining({ email: 'test-14@email.com' }),
      expect.objectContaining({ email: 'test-15@email.com' }),
      expect.objectContaining({ email: 'test-16@email.com' }),
      expect.objectContaining({ email: 'test-17@email.com' }),
      expect.objectContaining({ email: 'test-18@email.com' }),
      expect.objectContaining({ email: 'test-19@email.com' }),
    ]);
  });

  it("should be able to filter the list of admins by email", async () => {
    for (let i = 0; i < 10; i++) {
      const admin = makeAdmin({
        email: `test-${i}@email.com`
      });
      await authProvider.signup(admin);
    }

    const response = await sut.execute({
      page: 1,
      limit: 10,
      email: "test-1@email.com"
    });

    expect(response.list).toHaveLength(1);
  });

  it("should be able to filter the list of admins by status", async () => {
    for (let i = 0; i < 10; i++) {
      const admin = makeAdmin({
        email: `test-${i}@email.com`,
        status: i === 5 ? AdminStatus.ACTIVE : AdminStatus.PENDING
      });
      await authProvider.signup(admin);
    }

    const response = await sut.execute({
      page: 1,
      limit: 10,
      status: AdminStatus.ACTIVE
    });

    expect(response.list).toHaveLength(1);
  });
})