import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const MAX_SIGNATURE_BYTES = 100 * 1024;

@ValidatorConstraint({ name: 'isPodSignatureUrl', async: false })
export class IsPodSignatureUrlConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value == null || value === '') return true;
    if (typeof value !== 'string') return false;

    const svgMatch = /^data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)$/.exec(
      value,
    );
    if (svgMatch) {
      return Buffer.from(svgMatch[1], 'base64').length <= MAX_SIGNATURE_BYTES;
    }

    const pngMatch = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(value);
    if (pngMatch) {
      return Buffer.from(pngMatch[1], 'base64').length <= MAX_SIGNATURE_BYTES;
    }

    return false;
  }

  defaultMessage(): string {
    return 'signatureUrl må være en gyldig SVG- eller PNG data-URI (maks 100 KB)';
  }
}

export function IsPodSignatureUrl(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsPodSignatureUrlConstraint,
    });
  };
}
