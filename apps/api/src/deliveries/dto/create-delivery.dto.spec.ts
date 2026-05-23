import { validate } from 'class-validator';
import { CreateDeliveryDto } from './create-delivery.dto';

describe('CreateDeliveryDto', () => {
  it('requires customer name, address and weight', async () => {
    const dto = new CreateDeliveryDto();
    const errors = await validate(dto);
    const props = errors.map((e) => e.property);
    expect(props).toContain('customerName');
    expect(props).toContain('address');
    expect(props).toContain('weightKg');
  });

  it('accepts valid delivery payload', async () => {
    const dto = new CreateDeliveryDto();
    dto.customerName = 'Kunde AS';
    dto.address = 'Karl Johans gate 1, Oslo';
    dto.weightKg = 12.5;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
