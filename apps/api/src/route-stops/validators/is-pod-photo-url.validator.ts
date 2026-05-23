import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const MAX_DECODED_BYTES = 500_000;
const DATA_URI_PATTERN = /^data:image\/(jpeg|png);base64,/i;

@ValidatorConstraint({ name: 'isPodPhotoUrl', async: false })
export class IsPodPhotoUrlConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value == null || value === '') {
      return true;
    }
    if (typeof value !== 'string') {
      return false;
    }
    if (!DATA_URI_PATTERN.test(value)) {
      return false;
    }
    const base64 = value.split(',')[1];
    if (!base64) {
      return false;
    }
    try {
      const size = Buffer.from(base64, 'base64').length;
      return size > 0 && size <= MAX_DECODED_BYTES;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'photoUrl must be a JPEG or PNG data URI under 500KB';
  }
}

export function IsPodPhotoUrl(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsPodPhotoUrlConstraint,
    });
  };
}
