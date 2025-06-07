export const URLs = {
  // Base URLs
  BASE_URL: 'https://clasor-frontend.sandpod.ir',
  SSO_URL: 'https://sso-sandbox.sandpod.ir/oauth2/authorize/index.html',

  // Auth URLs
  LOGIN: '/',
  SIGNIN: '/signin',
  DASHBOARD: '/admin/dashboard',

  // Repository URLs
  REPOSITORY_MANAGEMENT: '/admin/dashboard',
  MY_REPOSITORIES: '/admin/dashboard',
  CREATE_REPOSITORY: '/admin/repository/create',
  EDIT_REPOSITORY: (id: string) => `/admin/repository/${id}/edit`,
  VIEW_REPOSITORY: (id: string) => `/admin/repository/${id}`,

  // SSO Parameters
  SSO_PARAMS: {
    client_id: '18682629g64434d74b0004e8ecb3d3be1',
    response_type: 'code',
    redirect_uri: 'https://clasor-frontend.sandpod.ir/signin',
    scope: 'profile',
  },
} as const;

// Helper function to get full URL
export const getFullUrl = (path: string): string => {
  return `${URLs.BASE_URL}${path}`;
};

// Helper function to get full URL with parameters
export const getFullUrlWithParams = (
  path: string,
  params: Record<string, string>
): string => {
  const url = new URL(getFullUrl(path));
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
};

// Helper function to get SSO URL with parameters
export const getSSOUrl = (): string => {
  return getFullUrlWithParams(URLs.SSO_URL, URLs.SSO_PARAMS);
};
