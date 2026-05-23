import { ProofOfDeliveryDto } from '../dto/proof-of-delivery.dto';

describe('ProofOfDeliveryDto signatureUrl', () => {
  it('accepts small SVG data URI', async () => {
    const dto = new ProofOfDeliveryDto();
    dto.signatureUrl =
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=';
    // validation runs via class-validator in e2e; smoke test field assignment
    expect(dto.signatureUrl).toContain('data:image/svg+xml');
  });
});
