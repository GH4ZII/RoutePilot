import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { OrgScopeService } from '../common/org-scope.service';
import { resolvePlannedDate, formatDate } from '../common/report-date.util';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';
import type { DailyReportQueryDto } from './dto/reports-query.dto';
import type { RangeReportQueryDto } from './dto/reports-query.dto';

@Injectable()
export class ReportsExportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
    private readonly reports: ReportsService,
  ) {}

  async exportDailyCsv(
    user: JwtPayload,
    query: DailyReportQueryDto,
  ): Promise<string> {
    const plannedDate = resolvePlannedDate(query.date);
    const deliveries = await this.prisma.delivery.findMany({
      where: this.orgScope.forOrganization(user, {
        routeStops: {
          some: {
            route: { plannedDate },
          },
        },
      }),
      orderBy: { customerName: 'asc' },
    });

    const header =
      'id,customerName,phone,address,status,priority,weightKg,deadline';
    const rows = deliveries.map((d) =>
      [
        d.id,
        csvEscape(d.customerName),
        csvEscape(d.phone ?? ''),
        csvEscape(d.address),
        d.status,
        d.priority,
        d.weightKg,
        d.deadline?.toISOString() ?? '',
      ].join(','),
    );
    return [header, ...rows].join('\n');
  }

  async exportRouteEfficiencyCsv(
    user: JwtPayload,
    query: RangeReportQueryDto,
  ): Promise<string> {
    const report = await this.reports.getRouteEfficiency(user, query);
    const header =
      'routeId,plannedDate,driver,vehicle,plannedDistanceMeters,actualDurationSeconds,capacityUtilizationPercent,stopCompletionRate,avgArrivalDeltaMinutes';
    const rows = report.routes.map((r) =>
      [
        r.routeId,
        r.plannedDate,
        csvEscape(r.driver?.name ?? ''),
        csvEscape(r.vehicle?.name ?? ''),
        r.plannedDistanceMeters ?? '',
        r.actualDurationSeconds ?? '',
        r.capacityUtilizationPercent ?? '',
        r.stopCompletionRate ?? '',
        r.avgArrivalDeltaMinutes ?? '',
      ].join(','),
    );
    return [header, ...rows].join('\n');
  }

  async exportRoutePdf(
    user: JwtPayload,
    routeId: string,
  ): Promise<Buffer> {
    const route = await this.prisma.route.findFirst({
      where: this.orgScope.forOrganization(user, { id: routeId }),
      include: {
        driver: true,
        vehicle: true,
        stops: {
          orderBy: { stopOrder: 'asc' },
          include: { delivery: true, proofOfDelivery: true },
        },
      },
    });
    if (!route) {
      throw new NotFoundException('Rute ikke funnet');
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(18).text('RoutePilot — Ruterapport', { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(`Rute: ${route.id}`);
      doc.text(`Status: ${route.status}`);
      doc.text(`Planlagt dato: ${formatDate(route.plannedDate)}`);
      doc.text(`Sjåfør: ${route.driver?.name ?? '—'}`);
      doc.text(`Kjøretøy: ${route.vehicle?.name ?? '—'}`);
      doc.text(
        `Planlagt distanse: ${route.totalDistanceMeters != null ? `${(route.totalDistanceMeters / 1000).toFixed(1)} km` : '—'}`,
      );
      doc.moveDown();
      doc.text('Stopp:', { underline: true });

      for (const stop of route.stops) {
        doc.moveDown(0.5);
        doc.text(
          `${stop.stopOrder}. ${stop.delivery.customerName} — ${stop.status}`,
        );
        doc.text(`   ${stop.delivery.address}`);
        if (stop.proofOfDelivery) {
          doc.text(
            `   POD: ${stop.proofOfDelivery.capturedAt.toISOString()} (foto: ${stop.proofOfDelivery.photoUrl ? 'ja' : 'nei'})`,
          );
        }
      }

      doc.end();
    });
  }
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
