export const PASSWORD_MIN_LENGTH = 8;

export const ORGANIZATION_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeOrganizationSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Passord må være minst ${PASSWORD_MIN_LENGTH} tegn.`;
  }
  return null;
}

export function validateOrganizationSlug(slug: string): string | null {
  if (!slug) {
    return 'Organisasjon (slug) er påkrevd.';
  }
  if (!ORGANIZATION_SLUG_PATTERN.test(slug)) {
    return 'Kun små bokstaver, tall og bindestrek (f.eks. min-bedrift).';
  }
  return null;
}
