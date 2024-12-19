import { describe, beforeEach, it, expect } from 'vitest';
import { FakeAuthAdminProvider } from '../../../../../../../tests/auth-provider/fake-auth-admin-provider';
import { AdminStatus } from '../../../../../../core/enums/admin-status-enum';
import { UserRole } from '../../../../../../core/enums/user-role-enum';
import { InviteAdminUseCase } from '../invite-admin-use-case';

let authProvider: FakeAuthAdminProvider;
let sut: InviteAdminUseCase;

describe("Invite admin", () => {

  beforeEach(() => {
    authProvider = new FakeAuthAdminProvider();
    sut = new InviteAdminUseCase(authProvider);
  });

  it("should be able to invite a user with admin role and start status Pending", async () => {
    await sut.execute("john@doe.com", "John Doe");

    expect(authProvider.admins[0].user_metadata.fullname).toEqual("John Doe");
    expect(authProvider.admins[0].user_metadata.status).toEqual(AdminStatus.PENDING);
    expect(authProvider.admins[0].user_metadata.role).toEqual(UserRole.ADMIN);
  });
});