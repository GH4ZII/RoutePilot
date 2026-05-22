import type { Decimal } from '../generated/prisma/internal/prismaNamespace';

export function decimalToNumber(
  value: Decimal | null | undefined,
): number | null {
  if (value == null) {
    return null;
  }
  return Number(value);
}
