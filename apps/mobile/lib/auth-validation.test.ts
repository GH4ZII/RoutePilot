import {
  normalizeOrganizationSlug,
  validateOrganizationSlug,
  validatePassword,
} from './auth-validation';

describe('auth-validation', () => {
  it('normalizeOrganizationSlug strips invalid characters', () => {
    expect(normalizeOrganizationSlug('Min Bedrift!')).toBe('minbedrift');
  });

  it('validatePassword rejects short passwords', () => {
    expect(validatePassword('short')).toMatch(/minst 8 tegn/i);
  });

  it('validateOrganizationSlug requires slug format', () => {
    expect(validateOrganizationSlug('')).toMatch(/påkrevd/i);
    expect(validateOrganizationSlug('Invalid_Slug')).toMatch(/bindestrek/i);
    expect(validateOrganizationSlug('min-bedrift')).toBeNull();
  });
});
