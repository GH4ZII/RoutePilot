import { BadRequestException } from '@nestjs/common';

export const MAX_REPORT_RANGE_DAYS = 90;

export function resolvePlannedDate(dateParam?: string): Date {
  if (dateParam) {
    const parsed = new Date(`${dateParam}T12:00:00.000Z`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseDateParam(value: string): Date {
  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestException(`Invalid date: ${value}`);
  }
  return parsed;
}

export function resolveDateRange(
  fromParam?: string,
  toParam?: string,
): { from: Date; to: Date } {
  const to = toParam ? parseDateParam(toParam) : resolvePlannedDate();
  const fromDefault = new Date(to);
  fromDefault.setUTCDate(fromDefault.getUTCDate() - 6);

  const from = fromParam ? parseDateParam(fromParam) : fromDefault;

  if (from.getTime() > to.getTime()) {
    throw new BadRequestException('from must be on or before to');
  }

  const diffMs = to.getTime() - from.getTime();
  const diffDays = diffMs / (24 * 60 * 60 * 1000);
  if (diffDays > MAX_REPORT_RANGE_DAYS) {
    throw new BadRequestException(
      `Date range cannot exceed ${MAX_REPORT_RANGE_DAYS} days`,
    );
  }

  return { from, to };
}

export function arrivalDeltaMinutes(
  estimated: Date | null,
  actual: Date | null,
): number | null {
  if (!estimated || !actual) return null;
  return (actual.getTime() - estimated.getTime()) / 60_000;
}

export function isOnTime(
  estimated: Date | null,
  actual: Date | null,
): boolean | null {
  const delta = arrivalDeltaMinutes(estimated, actual);
  if (delta == null) return null;
  return delta <= 0;
}
