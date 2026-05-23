import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    organization: { findUnique: jest.Mock };
    user: { findUnique: jest.Mock };
    driver: { findFirst: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      organization: { findUnique: jest.fn() },
      user: { findUnique: jest.fn() },
      driver: { findFirst: jest.fn().mockResolvedValue(null) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('token') },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('7d') },
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('login', () => {
    it('throws when organization is unknown', async () => {
      prisma.organization.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'a@b.no',
          password: 'secret',
          organizationSlug: 'missing',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('returns token for valid credentials', async () => {
      const passwordHash = await bcrypt.hash('secret', 4);
      prisma.organization.findUnique.mockResolvedValue({
        id: 'org-1',
        name: 'Test',
        slug: 'test',
      });
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.no',
        name: 'Admin',
        role: 'ADMIN',
        organizationId: 'org-1',
        passwordHash,
      });

      const result = await service.login({
        email: 'a@b.no',
        password: 'secret',
        organizationSlug: 'test',
      });

      expect(result.accessToken).toBe('token');
      expect(result.user.email).toBe('a@b.no');
    });
  });
});
