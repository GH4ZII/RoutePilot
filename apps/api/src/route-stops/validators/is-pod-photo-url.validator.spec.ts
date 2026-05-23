import { validate } from 'class-validator';
import { ProofOfDeliveryDto } from '../dto/proof-of-delivery.dto';

describe('ProofOfDeliveryDto photoUrl', () => {
  it('accepts valid PNG data URI', async () => {
    const png = Buffer.from('small').toString('base64');
    const dto = new ProofOfDeliveryDto();
    dto.photoUrl = `data:image/png;base64,${png}`;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects non-data-URI URLs', async () => {
    const dto = new ProofOfDeliveryDto();
    dto.photoUrl = 'https://example.com/photo.jpg';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'photoUrl')).toBe(true);
  });

  it('rejects oversized payloads', async () => {
    const huge = Buffer.alloc(600_000).toString('base64');
    const dto = new ProofOfDeliveryDto();
    dto.photoUrl = `data:image/jpeg;base64,${huge}`;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'photoUrl')).toBe(true);
  });
});
