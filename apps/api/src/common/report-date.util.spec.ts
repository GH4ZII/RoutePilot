import { BadRequestException } from '@nestjs/common';
import {
  arrivalDeltaMinutes,
  isOnTime,
  resolveDateRange,
  resolvePlannedDate,
} from './report-date.util';

describe('report-date.util', () => {
  it('resolvePlannedDate parses ISO date', () => {
    const d = resolvePlannedDate('2026-05-20');
    expect(d.toISOString()).toBe('2026-05-20T12:00:00.000Z');
  });

  it('resolveDateRange rejects inverted range', () => {
    expect(() =>
      resolveDateRange('2026-05-25', '2026-05-20'),
    ).toThrow(BadRequestException);
  });

  it('resolveDateRange rejects ranges over 90 days', () => {
    expect(() =>
      resolveDateRange('2026-01-01', '2026-05-01'),
    ).toThrow(BadRequestException);
  });

  it('isOnTime returns true when actual is before estimated', () => {
    const estimated = new Date('2026-05-20T11:00:00Z');
    const actual = new Date('2026-05-20T10:30:00Z');
    expect(isOnTime(estimated, actual)).toBe(true);
    expect(arrivalDeltaMinutes(estimated, actual)).toBe(-30);
  });
});
