import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { ReportsController } from '../src/reports/reports.controller';
import { ReportsService } from '../src/reports/reports.service';

function authGuard(): CanActivate {
  return {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      req.user = {
        sub: 'user-1',
        organizationId: 'org-1',
        role: 'DISPATCHER',
      };
      return true;
    },
  };
}

describe('Reports (e2e)', () => {
  let app: INestApplication<App>;

  const mockDaily = {
    date: '2026-05-20',
    deliveries: {
      pending: 0,
      assigned: 0,
      inProgress: 0,
      delivered: 1,
      failed: 0,
      cancelled: 0,
      total: 1,
    },
    routes: { planned: 1, completed: 1, active: 0 },
    totals: {
      distanceMeters: 1000,
      durationSeconds: 600,
      stopsCompleted: 1,
      stopsFailed: 0,
    },
    onTimeRate: 100,
  };

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: {
            getDaily: jest.fn().mockResolvedValue(mockDaily),
            getDriverPerformance: jest.fn().mockResolvedValue({
              from: '2026-05-15',
              to: '2026-05-20',
              drivers: [],
            }),
            getRouteEfficiency: jest.fn().mockResolvedValue({
              from: '2026-05-15',
              to: '2026-05-20',
              routes: [],
            }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(authGuard())
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    const nestApp = moduleFixture.createNestApplication();
    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await nestApp.init();
    app = nestApp as INestApplication<App>;
  });

  afterEach(async () => {
    await app?.close();
  });

  it('GET /reports/daily returns 200 for dispatcher', () => {
    return request(app.getHttpServer())
      .get('/reports/daily?date=2026-05-20')
      .expect(200)
      .expect((res) => {
        expect(res.body.date).toBe('2026-05-20');
        expect(res.body.deliveries.delivered).toBe(1);
      });
  });

  it('GET /reports/daily rejects invalid date', () => {
    return request(app.getHttpServer())
      .get('/reports/daily?date=not-a-date')
      .expect(400);
  });
});
