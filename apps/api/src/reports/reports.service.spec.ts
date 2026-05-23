import { Test, TestingModule } from '@nestjs/testing';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';
import type { JwtPayload } from '../auth/types/jwt-payload';

const user: JwtPayload = {
  sub: 'user-1',
  organizationId: 'org-1',
  role: 'DISPATCHER',
};

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: {
    route: { findMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      route: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: OrgScopeService,
          useValue: {
            forOrganization: jest.fn((_u, where = {}) => ({
              organizationId: 'org-1',
              ...where,
            })),
          },
        },
      ],
    }).compile();

    service = module.get(ReportsService);
  });

  describe('getDaily', () => {
    it('aggregates delivery status and on-time rate from routes', async () => {
      prisma.route.findMany.mockResolvedValue([
        {
          id: 'route-1',
          status: 'COMPLETED',
          totalDistanceMeters: 5000,
          totalDurationSeconds: 3600,
          stops: [
            {
              deliveryId: 'd1',
              status: 'COMPLETED',
              estimatedArrival: new Date('2026-05-20T10:00:00Z'),
              actualArrival: new Date('2026-05-20T09:55:00Z'),
              delivery: { status: 'DELIVERED' },
            },
            {
              deliveryId: 'd2',
              status: 'FAILED',
              estimatedArrival: null,
              actualArrival: null,
              delivery: { status: 'FAILED' },
            },
          ],
        },
        {
          id: 'route-2',
          status: 'IN_PROGRESS',
          totalDistanceMeters: 2000,
          totalDurationSeconds: 1200,
          stops: [
            {
              deliveryId: 'd3',
              status: 'COMPLETED',
              estimatedArrival: new Date('2026-05-20T11:00:00Z'),
              actualArrival: new Date('2026-05-20T11:30:00Z'),
              delivery: { status: 'DELIVERED' },
            },
          ],
        },
      ]);

      const result = await service.getDaily(user, { date: '2026-05-20' });

      expect(prisma.route.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: 'org-1' }),
        }),
      );
      expect(result.deliveries.delivered).toBe(2);
      expect(result.deliveries.failed).toBe(1);
      expect(result.routes.planned).toBe(2);
      expect(result.routes.completed).toBe(1);
      expect(result.routes.active).toBe(1);
      expect(result.totals.distanceMeters).toBe(7000);
      expect(result.totals.stopsCompleted).toBe(2);
      expect(result.totals.stopsFailed).toBe(1);
      expect(result.onTimeRate).toBe(50);
    });
  });

  describe('getDriverPerformance', () => {
    it('groups metrics by driver', async () => {
      prisma.route.findMany.mockResolvedValue([
        {
          driverId: 'drv-1',
          driver: { name: 'Ola' },
          status: 'COMPLETED',
          stops: [
            {
              status: 'COMPLETED',
              estimatedArrival: new Date('2026-05-20T10:00:00Z'),
              actualArrival: new Date('2026-05-20T10:00:00Z'),
            },
          ],
        },
      ]);

      const result = await service.getDriverPerformance(user, {
        from: '2026-05-15',
        to: '2026-05-20',
      });

      expect(result.drivers).toHaveLength(1);
      expect(result.drivers[0]).toMatchObject({
        driverId: 'drv-1',
        name: 'Ola',
        routesCompleted: 1,
        stopsCompleted: 1,
        onTimePercent: 100,
      });
    });
  });
});
