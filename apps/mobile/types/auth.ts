export type Organization = {
  id: string;
  name: string;
  slug: string;
};

export type UserRole = 'ADMIN' | 'DISPATCHER' | 'DRIVER';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  organization: Organization;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type LoginCredentials = {
  organizationSlug: string;
  email: string;
  password: string;
};

export type RegisterCredentials = {
  organizationName: string;
  organizationSlug: string;
  email: string;
  password: string;
  name?: string;
};
