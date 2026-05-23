import { ForbiddenException } from '@nestjs/common';
import { OrgScopeService } from './org-scope.service';
import type { JwtPayload } from '../auth/types/jwt-payload';

describe('OrgScopeService', () => {
  const service = new OrgScopeService();

  const user: JwtPayload = {
    sub: 'user-1',
    organizationId: 'org-abc',
    role: 'DISPATCHER',
  };

  it('merges organizationId into where clause', () => {
    expect(service.forOrganization(user, { status: 'PENDING' })).toEqual({
      status: 'PENDING',
      organizationId: 'org-abc',
    });
  });

  it('throws when organizationId is missing', () => {
    expect(() =>
      service.forOrganization({ sub: 'x', organizationId: '', role: 'ADMIN' }),
    ).toThrow(ForbiddenException);
  });
});
