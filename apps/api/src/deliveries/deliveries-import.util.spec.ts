import { parseDeliveriesCsv } from './deliveries-import.util';

describe('parseDeliveriesCsv', () => {
  it('parses valid CSV rows', () => {
    const csv = `customerName,address,weightKg,priority
Ola Nordmann,Storgata 1 Oslo,10,HIGH
Kari,Youngs gate 2,5,NORMAL`;

    const { rows, errors } = parseDeliveriesCsv(csv);
    expect(errors).toHaveLength(0);
    expect(rows).toHaveLength(2);
    expect(rows[0].customerName).toBe('Ola Nordmann');
    expect(rows[0].priority).toBe('HIGH');
  });

  it('reports missing required fields', () => {
    const csv = 'customerName,address,weightKg\n,Gate 1,1';
    const { rows, errors } = parseDeliveriesCsv(csv);
    expect(rows).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });
});
