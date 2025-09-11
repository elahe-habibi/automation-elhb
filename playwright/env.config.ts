import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Environment Configuration
export const ENV_CONFIG = {
  // Base URLs
  BASE_URL: process.env.BASE_URL || 'https://clasor-frontend.sandpod.ir',
  SSO_URL:
    process.env.SSO_URL ||
    'https://sso-sandbox.sandpod.ir/oauth2/authorize/index.html',

  // Auth URLs
  LOGIN: process.env.LOGIN || '/',
  SIGNIN: process.env.SIGNIN || '/signin',
  DASHBOARD: process.env.DASHBOARD || '/admin/dashboard',

  // Repository URLs
  REPOSITORY_MANAGEMENT:
    process.env.REPOSITORY_MANAGEMENT || '/admin/dashboard',
  MY_REPOSITORIES: process.env.MY_REPOSITORIES || '/admin/dashboard',
  CREATE_REPOSITORY:
    process.env.CREATE_REPOSITORY || '/admin/repository/create',

  // SSO Parameters
  SSO_PARAMS: {
    client_id: process.env.SSO_CLIENT_ID || '18682629g64434d74b0004e8ecb3d3be1',
    response_type: process.env.SSO_RESPONSE_TYPE || 'code',
    redirect_uri:
      process.env.SSO_REDIRECT_URI ||
      'https://clasor-frontend.sandpod.ir/signin',
    scope: process.env.SSO_SCOPE || 'profile',
  },

  // Test Configuration
  HEADLESS: process.env.HEADLESS === 'true' || true,
  BROWSER: process.env.BROWSER || 'chromium',
  TIMEOUT: parseInt(process.env.TIMEOUT || '30000'),
} as const;

// Helper function to get full URL
export const getFullUrl = (path: string): string => {
  return `${ENV_CONFIG.BASE_URL}${path}`;
};

// Helper function to get full URL with parameters
export const getFullUrlWithParams = (
  path: string,
  params: Record<string, string>,
): string => {
  const url = new URL(getFullUrl(path));
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
};

// Helper function to get SSO URL with parameters
export const getSSOUrl = (): string => {
  return getFullUrlWithParams(ENV_CONFIG.SSO_URL, ENV_CONFIG.SSO_PARAMS);
};

// Helper function to get repository URLs with ID
export const getRepositoryUrl = {
  edit: (id: string) => `/admin/repository/${id}/edit`,
  view: (id: string) => `/admin/repository/${id}`,
};
