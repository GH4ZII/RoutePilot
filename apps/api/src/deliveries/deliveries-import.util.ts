import { parse } from 'csv-parse/sync';
import { DeliveryPriority } from '../generated/prisma/client';

export type CsvDeliveryRow = {
  row: number;
  customerName: string;
  phone?: string;
  address: string;
  weightKg: number;
  volumeM3?: number;
  priority: DeliveryPriority;
  deadline?: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  notes?: string;
};

export type CsvParseError = { row: number; message: string };

const HEADER_MAP: Record<string, keyof Omit<CsvDeliveryRow, 'row'>> = {
  customername: 'customerName',
  customer_name: 'customerName',
  phone: 'phone',
  address: 'address',
  weightkg: 'weightKg',
  weight_kg: 'weightKg',
  volumem3: 'volumeM3',
  volume_m3: 'volumeM3',
  priority: 'priority',
  deadline: 'deadline',
  timewindowstart: 'timeWindowStart',
  time_window_start: 'timeWindowStart',
  timewindowend: 'timeWindowEnd',
  time_window_end: 'timeWindowEnd',
  notes: 'notes',
};

export function parseDeliveriesCsv(
  content: string,
): { rows: CsvDeliveryRow[]; errors: CsvParseError[] } {
  const errors: CsvParseError[] = [];
  let records: Record<string, string>[];

  try {
    records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as Record<string, string>[];
  } catch (err) {
    return {
      rows: [],
      errors: [
        {
          row: 0,
          message:
            err instanceof Error ? err.message : 'Kunne ikke parse CSV-fil',
        },
      ],
    };
  }

  if (records.length === 0) {
    return { rows: [], errors: [{ row: 0, message: 'CSV-filen er tom' }] };
  }

  const normalizedHeaders = Object.keys(records[0]).reduce(
    (acc, key) => {
      acc[key.toLowerCase().replace(/\s+/g, '')] = key;
      return acc;
    },
    {} as Record<string, string>,
  );

  const rows: CsvDeliveryRow[] = [];

  records.forEach((record, index) => {
    const rowNum = index + 2;
    const mapped: Partial<CsvDeliveryRow> = { row: rowNum };

    for (const [normKey, field] of Object.entries(HEADER_MAP)) {
      const originalKey = normalizedHeaders[normKey];
      if (originalKey && record[originalKey]) {
        (mapped as Record<string, unknown>)[field] = record[originalKey];
      }
    }

    if (!mapped.customerName?.trim()) {
      errors.push({ row: rowNum, message: 'customerName mangler' });
      return;
    }
    if (!mapped.address?.trim()) {
      errors.push({ row: rowNum, message: 'address mangler' });
      return;
    }

    const weight = Number(mapped.weightKg);
    if (!Number.isFinite(weight) || weight <= 0) {
      errors.push({ row: rowNum, message: 'weightKg må være et positivt tall' });
      return;
    }

    let priority: DeliveryPriority = DeliveryPriority.NORMAL;
    if (mapped.priority) {
      const p = String(mapped.priority).toUpperCase();
      if (Object.values(DeliveryPriority).includes(p as DeliveryPriority)) {
        priority = p as DeliveryPriority;
      } else {
        errors.push({ row: rowNum, message: `Ugyldig priority: ${mapped.priority}` });
        return;
      }
    }

    let volumeM3: number | undefined;
    if (mapped.volumeM3 != null && String(mapped.volumeM3).trim() !== '') {
      volumeM3 = Number(mapped.volumeM3);
      if (!Number.isFinite(volumeM3) || volumeM3 < 0) {
        errors.push({ row: rowNum, message: 'volumeM3 må være et gyldig tall' });
        return;
      }
    }

    rows.push({
      row: rowNum,
      customerName: mapped.customerName.trim(),
      phone: mapped.phone?.trim() || undefined,
      address: mapped.address.trim(),
      weightKg: weight,
      volumeM3,
      priority,
      deadline: mapped.deadline?.trim() || undefined,
      timeWindowStart: mapped.timeWindowStart?.trim() || undefined,
      timeWindowEnd: mapped.timeWindowEnd?.trim() || undefined,
      notes: mapped.notes?.trim() || undefined,
    });
  });

  return { rows, errors };
}
